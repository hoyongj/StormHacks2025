import { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { PlanStop, TravelPlan } from "../App";
import "./ToGoList.css";

type ToGoListProps = {
    plan: TravelPlan | null;
    draftStops?: PlanStop[] | null;
    isLoading?: boolean;
    onSelectStop?: (stop: PlanStop, index: number) => void;
    selectedStopIndex?: number | null;
    onAddStop?: () => void;
    onUpdateStop?: (index: number, updates: Partial<PlanStop>) => void;
    onRemoveStop?: (index: number) => void;
    onSave?: () => void;
    hasPendingChanges?: boolean;
};

const clampToRange = (value: number, min: number, max: number): number => {
    if (Number.isNaN(value)) {
        return min;
    }
    return Math.min(Math.max(value, min), max);
};

const normaliseTimeParts = (days: number, hours: number, minutes: number) => ({
    timeToSpendDays: clampToRange(Math.floor(days), 0, 365),
    timeToSpendHours: clampToRange(Math.floor(hours), 0, 23),
    timeToSpendMinutes: clampToRange(Math.floor(minutes), 0, 59),
});

const durationLabel = (stop: PlanStop): string | null => {
    const tokens: string[] = [];
    if (typeof stop.timeToSpendDays === "number" && stop.timeToSpendDays > 0) {
        tokens.push(`${stop.timeToSpendDays}d`);
    }
    if (
        typeof stop.timeToSpendHours === "number" &&
        stop.timeToSpendHours > 0
    ) {
        tokens.push(`${stop.timeToSpendHours}h`);
    }
    if (
        typeof stop.timeToSpendMinutes === "number" &&
        stop.timeToSpendMinutes > 0
    ) {
        tokens.push(`${stop.timeToSpendMinutes}m`);
    }
    if (!tokens.length) {
        return null;
    }
    return tokens.join(" ");
};

function ToGoList({
    plan,
    draftStops = null,
    isLoading = false,
    onSelectStop,
    selectedStopIndex = null,
    onAddStop,
    onUpdateStop,
    onRemoveStop,
    onSave,
    hasPendingChanges = false,
}: ToGoListProps) {
    const planStops = plan?.stops ?? [];
    const formStops = draftStops ?? planStops;
    const allStopsLength = Math.max(planStops.length, formStops.length);
    const hasPlan = Boolean(plan);
    const isEditable = Boolean(onUpdateStop);
    const [expandedStops, setExpandedStops] = useState<Record<number, boolean>>(
        {}
    );
    const previousCountRef = useRef(formStops.length);
    const listRef = useRef<HTMLOListElement | null>(null);
    const displayNameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const pendingFocusIndexRef = useRef<number | null>(null);
    const autocompleteServiceRef =
        useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
        null
    );
    const predictionStoreRef = useRef<
        Record<number, google.maps.places.AutocompletePrediction[]>
    >({});
    const [predictionTick, setPredictionTick] = useState(0);
    const requestIdRef = useRef(0);
    const loaderRef = useRef<Loader | null>(null);
    const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        setExpandedStops({});
        previousCountRef.current = formStops.length;
        displayNameInputRefs.current = [];
        itemRefs.current = [];
        pendingFocusIndexRef.current = null;
    }, [plan?.id]);

    useEffect(() => {
        if (formStops.length > previousCountRef.current) {
            const newIndex = formStops.length - 1;
            pendingFocusIndexRef.current = newIndex;
            // When a new stop is added, collapse any other expanded stops
            // and only expand the newly-added stop.
            setExpandedStops(() => ({ [newIndex]: true }));
        }
        previousCountRef.current = formStops.length;
    }, [formStops.length, formStops]);

    useEffect(() => {
        const index = pendingFocusIndexRef.current;
        if (index === null) {
            return;
        }
        const targetInput = displayNameInputRefs.current[index];
        const targetItem = itemRefs.current[index];
        const targetElement = targetInput ?? targetItem ?? null;

        if (targetInput) {
            targetInput.focus();
            targetInput.select();
        }

        const listElement = listRef.current;
        if (targetElement && listElement) {
            const elementOffset = targetElement.offsetTop;
            const desiredTop = Math.max(
                0,
                elementOffset - listElement.clientHeight * 0.25
            );
            listElement.scrollTo({
                top: desiredTop,
                behavior: "smooth",
            });
        } else if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }

        pendingFocusIndexRef.current = null;
    }, [formStops, expandedStops]);

    useEffect(() => {
        if (displayNameInputRefs.current.length > formStops.length) {
            displayNameInputRefs.current.length = formStops.length;
        }
        if (itemRefs.current.length > formStops.length) {
            itemRefs.current.length = formStops.length;
        }
    }, [formStops.length]);

    const durationSummaries = useMemo(
        () =>
            Array.from({ length: allStopsLength }).map((_, index) => {
                const savedStop = planStops[index] ?? null;
                const draftStop = formStops[index] ?? null;
                const displayStop = savedStop ?? draftStop;
                return displayStop ? durationLabel(displayStop) : null;
            }),
        [allStopsLength, planStops, formStops]
    );

    const removedOriginalIndices = useMemo(() => {
        if (!planStops.length) {
            return new Set<number>();
        }
        const presentIndices = new Set<number>();
        formStops.forEach((stop) => {
            if (stop && typeof stop.__originalIndex === "number") {
                presentIndices.add(stop.__originalIndex);
            }
        });
        const removed = new Set<number>();
        planStops.forEach((stop, index) => {
            const originalIndex =
                typeof stop.__originalIndex === "number"
                    ? stop.__originalIndex
                    : index;
            if (!presentIndices.has(originalIndex)) {
                removed.add(originalIndex);
            }
        });
        return removed;
    }, [planStops, formStops]);

    const predictionMap = useMemo(
        () => predictionStoreRef.current,
        [predictionTick]
    );

    const canSave = Boolean(isEditable && onSave && hasPendingChanges);
    const showUnsavedBadge = Boolean(isEditable && hasPendingChanges);
    const inputsDisabled = !isEditable;

    const toggleStopDetails = (index: number) => {
        setExpandedStops((prev) => {
            const isOpen = !prev[index];
            if (!isOpen && predictionStoreRef.current[index]) {
                const next = { ...predictionStoreRef.current };
                delete next[index];
                predictionStoreRef.current = next;
                setPredictionTick((tick) => tick + 1);
            }
            return { ...prev, [index]: isOpen };
        });
    };

    const handleLabelChange = (index: number, value: string) => {
        const currentStop = formStops[index];
        const trimmed = value;
        const updates: Partial<PlanStop> = { label: trimmed };
        const currentDisplay = currentStop?.displayName?.trim() ?? "";
        const currentLabel = currentStop?.label ?? "";
        if (!currentDisplay || currentDisplay === currentLabel) {
            updates.displayName = trimmed;
        }
        onUpdateStop?.(index, updates);
        fetchPredictions(index, value);
    };

    const handleDisplayNameChange = (index: number, value: string) => {
        // Preserve spaces the user types (including internal and trailing spaces)
        // so the input feels natural. Only collapse to undefined when the
        // string is empty. Trimming for storage can be handled on save/blurs.
        onUpdateStop?.(index, {
            displayName: value.length ? value : undefined,
        });
    };

    const handleDescriptionChange = (index: number, value: string) => {
        onUpdateStop?.(index, { description: value.length ? value : "" });
    };

    const handlePlaceIdChange = (index: number, value: string) => {
        const trimmed = value.trim();
        onUpdateStop?.(index, { placeId: trimmed || undefined });
    };

    const handleCoordinateChange = (
        index: number,
        key: "latitude" | "longitude",
        value: string
    ) => {
        const trimmed = value.trim();
        if (!trimmed) {
            onUpdateStop?.(index, { [key]: undefined } as Partial<PlanStop>);
            return;
        }

        const numeric = Number(trimmed);
        if (Number.isNaN(numeric)) {
            return;
        }

        onUpdateStop?.(index, { [key]: numeric } as Partial<PlanStop>);
    };

    const handleTimePieceChange = (
        index: number,
        field: "timeToSpendDays" | "timeToSpendHours" | "timeToSpendMinutes",
        rawValue: string
    ) => {
        if (!isEditable) {
            return;
        }
        const parsed = Number(rawValue);
        if (Number.isNaN(parsed) || parsed < 0) {
            return;
        }

        const stop = formStops[index];
        if (!stop) {
            return;
        }

        const nextValues = normaliseTimeParts(
            field === "timeToSpendDays" ? parsed : stop.timeToSpendDays ?? 0,
            field === "timeToSpendHours" ? parsed : stop.timeToSpendHours ?? 0,
            field === "timeToSpendMinutes"
                ? parsed
                : stop.timeToSpendMinutes ?? 0
        );

        onUpdateStop?.(index, nextValues);
    };

    const handleTimeClear = (index: number) => {
        if (!isEditable) {
            return;
        }
        onUpdateStop?.(index, {
            timeToSpendDays: undefined,
            timeToSpendHours: undefined,
            timeToSpendMinutes: undefined,
        });
    };

    const handleSaveClick = () => {
        if (!canSave) {
            return;
        }
        onSave?.();
    };

    const handleAddStopClick = () => {
        if (!isEditable || !onAddStop) {
            return;
        }
        onAddStop();
    };

    const handleRemoveStopClick = (index: number) => {
        if (!isEditable || !onRemoveStop) {
            return;
        }
        onRemoveStop(index);
        setExpandedStops((prev) => {
            const next: Record<number, boolean> = {};
            Object.entries(prev).forEach(([key, value]) => {
                const currentIndex = Number(key);
                if (currentIndex === index) {
                    return;
                }
                const newIndex =
                    currentIndex > index ? currentIndex - 1 : currentIndex;
                if (value) {
                    next[newIndex] = true;
                }
            });
            return next;
        });
        if (predictionStoreRef.current[index]) {
            const next = { ...predictionStoreRef.current };
            delete next[index];
            predictionStoreRef.current = next;
            setPredictionTick((tick) => tick + 1);
        }
    };

    const handleSelectStopClick = (stop: PlanStop, index: number) => {
        onSelectStop?.(stop, index);
    };

    useEffect(() => {
        if (
            !mapsApiKey ||
            autocompleteServiceRef.current ||
            typeof window === "undefined"
        ) {
            return;
        }

        const loader = (loaderRef.current ??= new Loader({
            apiKey: mapsApiKey,
            version: "weekly",
            libraries: ["places", "marker"],
        }));

        let cancelled = false;
        loader
            .load()
            .then((google) => {
                if (cancelled) {
                    return;
                }
                autocompleteServiceRef.current =
                    new google.maps.places.AutocompleteService();
                placesServiceRef.current = new google.maps.places.PlacesService(
                    document.createElement("div")
                );
            })
            .catch(() => {
                autocompleteServiceRef.current = null;
                placesServiceRef.current = null;
            });

        return () => {
            cancelled = true;
        };
    }, [mapsApiKey]);

    const updatePredictions = (
        index: number,
        values: google.maps.places.AutocompletePrediction[] | null
    ) => {
        if (!values || !values.length) {
            if (predictionStoreRef.current[index]) {
                const next = { ...predictionStoreRef.current };
                delete next[index];
                predictionStoreRef.current = next;
                setPredictionTick((tick) => tick + 1);
            }
            return;
        }

        predictionStoreRef.current = {
            ...predictionStoreRef.current,
            [index]: values,
        };
        setPredictionTick((tick) => tick + 1);
    };

    const fetchPredictions = (index: number, input: string) => {
        if (!autocompleteServiceRef.current || !input.trim()) {
            updatePredictions(index, null);
            return;
        }

        const currentRequest = ++requestIdRef.current;
        autocompleteServiceRef.current.getPlacePredictions(
            {
                input,
                componentRestrictions: { country: "CA" },
                bounds: new google.maps.LatLngBounds(
                    { lat: 48.18, lng: -139.06 }, // southwest corner near Vancouver Island edge
                    { lat: 60.0, lng: -114.05 } // northeast corner near BC/Yukon border
                ),
            },
            (predictions) => {
                if (currentRequest !== requestIdRef.current) {
                    return;
                }
                if (!predictions || !predictions.length) {
                    updatePredictions(index, null);
                } else {
                    updatePredictions(index, predictions);
                }
            }
        );
    };

    const handlePredictionSelect = (
        index: number,
        prediction: google.maps.places.AutocompletePrediction
    ) => {
        updatePredictions(index, null);

        const existingStop = formStops[index];
        const applySelection = (data: Partial<PlanStop>) => {
            const resolvedLabel =
                data.label ?? prediction.structured_formatting.main_text;
            const resolvedDisplay =
                existingStop?.displayName && existingStop.displayName.trim()
                    ? existingStop.displayName
                    : data.displayName ??
                      resolvedLabel ??
                      prediction.description;
            onUpdateStop?.(index, {
                label: resolvedLabel,
                displayName: resolvedDisplay ?? resolvedLabel,
                description:
                    data.description ??
                    prediction.structured_formatting.secondary_text ??
                    prediction.description,
                placeId: data.placeId ?? prediction.place_id,
                latitude: data.latitude,
                longitude: data.longitude,
            });
        };

        if (!placesServiceRef.current) {
            applySelection({});
            return;
        }

        placesServiceRef.current.getDetails(
            {
                placeId: prediction.place_id,
                fields: ["name", "formatted_address", "geometry", "place_id"],
            },
            (result, status) => {
                if (
                    status !== google.maps.places.PlacesServiceStatus.OK ||
                    !result
                ) {
                    applySelection({});
                    return;
                }

                applySelection({
                    label: result.name ?? undefined,
                    displayName: result.name ?? undefined,
                    description: result.formatted_address ?? undefined,
                    placeId: result.place_id ?? undefined,
                    latitude: result.geometry?.location?.lat(),
                    longitude: result.geometry?.location?.lng(),
                });
            }
        );
    };

    return (
        <section className="to-go">
            <header className="to-go__header">
                <div className="to-go__header-row">
                    <div>
                        <p className="to-go__eyebrow">To Go</p>
                        <h3>
                            {plan
                                ? "Upcoming stops"
                                : "Pick a plan to see your route"}
                        </h3>
                    </div>
                    <div className="to-go__header-actions">
                        {showUnsavedBadge ? (
                            <span className="to-go__draft-indicator">
                                Unsaved changes
                            </span>
                        ) : null}
                        <button
                            type="button"
                            className="to-go__button"
                            onClick={handleSaveClick}
                            disabled={!canSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="to-go__button to-go__button--secondary full-width"
                    onClick={handleAddStopClick}
                    disabled={!isEditable}
                >
                    Add Stop
                </button>
            </header>

            <ol className="to-go__list" ref={listRef}>
                {isLoading ? (
                    <li className="to-go__empty">Loading your stops…</li>
                ) : allStopsLength ? (
                    Array.from({ length: allStopsLength }).map((_, index) => {
                        const savedStop = planStops[index] ?? null;
                        const draftStop = formStops[index] ?? null;
                        if (!savedStop && !draftStop) {
                            return null;
                        }
                        const originalIndex =
                            savedStop && typeof savedStop.__originalIndex === "number"
                                ? savedStop.__originalIndex
                                : savedStop
                                ? index
                                : null;
                        const isRemoved =
                            typeof originalIndex === "number"
                                ? removedOriginalIndices.has(originalIndex)
                                : false;
                        const displayStop = savedStop ?? draftStop!;
                        const editableStop = isRemoved
                            ? savedStop!
                            : draftStop ?? savedStop!;
                        const isSelected = selectedStopIndex === index;
                        const isExpanded = expandedStops[index] ?? false;
                        const summary = durationSummaries[index];
                        const isNew = !savedStop && Boolean(draftStop);
                        const detailInputsDisabled =
                            inputsDisabled || isRemoved;

                        return (
                            <li
                                key={`${plan?.id ?? "plan"}-${index}`}
                                className={[
                                    "to-go__item",
                                    isSelected ? "to-go__item--selected" : "",
                                    isExpanded ? "to-go__item--open" : "",
                                    isNew ? "to-go__item--draft-new" : "",
                                    isRemoved
                                        ? "to-go__item--draft-removed"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                ref={(element) => {
                                    itemRefs.current[index] = element;
                                }}
                            >
                                <div className="to-go__item-header">
                                    <button
                                        type="button"
                                        className="to-go__item-select"
                                        disabled={isRemoved}
                                        onClick={() =>
                                            handleSelectStopClick(
                                                editableStop,
                                                index
                                            )
                                        }
                                        aria-pressed={isSelected}
                                    >
                                        <span className="to-go__step">
                                            {index + 1}
                                        </span>
                                        <div className="to-go__item-text">
                                            <span className="to-go__title">
                                                {(
                                                    editableStop.displayName ??
                                                    displayStop.displayName ??
                                                    displayStop.label ??
                                                    "Untitled stop"
                                                ).trim()}
                                            </span>
                                            {summary ? (
                                                <span className="to-go__time-pill">
                                                    {summary}
                                                </span>
                                            ) : null}
                                            {isNew ? (
                                                <span className="to-go__chip to-go__chip--new">
                                                    New
                                                </span>
                                            ) : null}
                                            {isRemoved ? (
                                                <span className="to-go__chip to-go__chip--removed">
                                                    Removed
                                                </span>
                                            ) : null}
                                        </div>
                                    </button>
                                    <div className="to-go__item-actions">
                                        <button
                                            type="button"
                                            className="to-go__action to-go__action--toggle"
                                            onClick={() =>
                                                toggleStopDetails(index)
                                            }
                                            disabled={isRemoved}
                                            aria-expanded={isExpanded}
                                        >
                                            {isExpanded ? "Hide" : "Details"}
                                        </button>
                                        <button
                                            type="button"
                                            className="to-go__action to-go__action--danger"
                                            onClick={() =>
                                                handleRemoveStopClick(index)
                                            }
                                            disabled={
                                                !isEditable || !onRemoveStop
                                            }
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className={
                                        isExpanded
                                            ? "to-go__item-details to-go__item-details--open"
                                            : "to-go__item-details"
                                    }
                                >
                                    <label className="to-go__field">
                                        <span>Display name</span>
                                        <input
                                            type="text"
                                            value={
                                                editableStop.displayName ?? ""
                                            }
                                            onChange={(event) =>
                                                handleDisplayNameChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="How should we refer to this stop?"
                                            disabled={detailInputsDisabled}
                                            ref={(element) => {
                                                displayNameInputRefs.current[
                                                    index
                                                ] = element;
                                            }}
                                        />
                                    </label>
                                    <label className="to-go__field">
                                        <span>Place name</span>
                                        <input
                                            type="text"
                                            value={editableStop.label}
                                            onChange={(event) =>
                                                handleLabelChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter stop name"
                                            disabled={detailInputsDisabled}
                                        />
                                    </label>

                                    {isExpanded &&
                                    (predictionMap[index]?.length ?? 0) ? (
                                        <ul
                                            className="to-go__suggestions"
                                            role="listbox"
                                        >
                                            {predictionMap[index]!.map(
                                                (prediction) => (
                                                    <li
                                                        key={
                                                            prediction.place_id
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            className="to-go__suggestion"
                                                            onClick={() =>
                                                                handlePredictionSelect(
                                                                    index,
                                                                    prediction
                                                                )
                                                            }
                                                            disabled={
                                                                detailInputsDisabled
                                                            }
                                                        >
                                                            <span className="to-go__suggestion-primary">
                                                                {
                                                                    prediction
                                                                        .structured_formatting
                                                                        .main_text
                                                                }
                                                            </span>
                                                            {prediction
                                                                .structured_formatting
                                                                .secondary_text ? (
                                                                <span className="to-go__suggestion-secondary">
                                                                    {
                                                                        prediction
                                                                            .structured_formatting
                                                                            .secondary_text
                                                                    }
                                                                </span>
                                                            ) : null}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : null}

                                    <label className="to-go__field">
                                        <span>Notes</span>
                                        <textarea
                                            value={
                                                editableStop.description ?? ""
                                            }
                                            onChange={(event) =>
                                                handleDescriptionChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Add optional notes"
                                            rows={2}
                                            disabled={detailInputsDisabled}
                                        />
                                    </label>

                                    <label className="to-go__field">
                                        <span>Place ID (optional)</span>
                                        <input
                                            type="text"
                                            value={editableStop.placeId ?? ""}
                                            onChange={(event) =>
                                                handlePlaceIdChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="ChIJ..."
                                            disabled={detailInputsDisabled}
                                        />
                                    </label>

                                    <div className="to-go__field-grid">
                                        <label className="to-go__field to-go__field--compact">
                                            <span>Days</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={
                                                    editableStop.timeToSpendDays ??
                                                    ""
                                                }
                                                onChange={(event) =>
                                                    handleTimePieceChange(
                                                        index,
                                                        "timeToSpendDays",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                disabled={detailInputsDisabled}
                                            />
                                        </label>
                                        <label className="to-go__field to-go__field--compact">
                                            <span>Hours</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="23"
                                                value={
                                                    editableStop.timeToSpendHours ??
                                                    ""
                                                }
                                                onChange={(event) =>
                                                    handleTimePieceChange(
                                                        index,
                                                        "timeToSpendHours",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                disabled={detailInputsDisabled}
                                            />
                                        </label>
                                        <label className="to-go__field to-go__field--compact">
                                            <span>Minutes</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={
                                                    editableStop.timeToSpendMinutes ??
                                                    ""
                                                }
                                                onChange={(event) =>
                                                    handleTimePieceChange(
                                                        index,
                                                        "timeToSpendMinutes",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                disabled={detailInputsDisabled}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            className="to-go__action to-go__action--ghost"
                                            onClick={() =>
                                                handleTimeClear(index)
                                            }
                                            disabled={detailInputsDisabled}
                                        >
                                            Clear time
                                        </button>
                                    </div>

                                    <div className="to-go__field-grid to-go__field-grid--address">
                                        <label className="to-go__field">
                                            <span>Address</span>
                                            <input
                                                type="text"
                                                value={
                                                    editableStop.description ??
                                                    ""
                                                }
                                                onChange={(event) =>
                                                    handleDescriptionChange(
                                                        index,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="123 Example St, Vancouver, BC"
                                                disabled={detailInputsDisabled}
                                            />
                                        </label>
                                    </div>
                                    {/* coordinates intentionally hidden from main UI */}
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <li className="to-go__empty">
                        <p>No stops yet. Start building your itinerary.</p>
                        <button
                            type="button"
                            className="to-go__button to-go__button--secondary"
                            onClick={handleAddStopClick}
                            disabled={!isEditable}
                        >
                            Add the first stop
                        </button>
                    </li>
                )}
            </ol>
        </section>
    );
}

export default ToGoList;
