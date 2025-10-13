// import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
// import {
//     DndContext,
//     KeyboardSensor,
//     PointerSensor,
//     type DragEndEvent,
//     useSensor,
//     useSensors,
// } from "@dnd-kit/core";
// import {
//     SortableContext,
//     sortableKeyboardCoordinates,
//     useSortable,
//     verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
// import { CSS } from "@dnd-kit/utilities";
// import { Loader } from "@googlemaps/js-api-loader";
// import type { PlanStop, TravelPlan } from "../App";
// import "./ToGoList.css";

// // Sortable item component for drag and drop functionality
// interface SortableStopItemProps {
//     id: string;
//     index: number;
//     rank: number;
//     isSelected: boolean;
//     isExpanded: boolean;
//     summary: string | null;
//     isNew: boolean;
//     displayTitle: string;
//     detailInputsDisabled: boolean;
//     stop: PlanStop;
//     handleSelectStopClick: (stop: PlanStop, index: number) => void;
//     toggleStopDetails: (index: number) => void;
//     handleRemoveStopClick: (index: number) => void;
//     handleDisplayNameChange: (index: number, value: string) => void;
//     handleLabelChange: (index: number, value: string) => void;
//     predictionMap: Record<number, google.maps.places.AutocompletePrediction[]>;
//     handlePredictionSelect: (
//         index: number,
//         prediction: google.maps.places.AutocompletePrediction
//     ) => void;
//     handleNotesChange: (index: number, value: string) => void;
//     handlePlaceIdChange: (index: number, value: string) => void;
//     handleTimePieceChange: (
//         index: number,
//         field: "timeToSpendDays" | "timeToSpendHours" | "timeToSpendMinutes",
//         value: string
//     ) => void;
//     handleTimeClear: (index: number) => void;
//     displayNameInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
//     labelInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
//     itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
//     activeFieldRef: React.MutableRefObject<{
//         index: number;
//         field: "display" | "label";
//     } | null>;
// }

// function SortableStopItem({
//     id,
//     index,
//     rank,
//     isSelected,
//     isExpanded,
//     summary,
//     isNew,
//     displayTitle,
//     detailInputsDisabled,
//     stop,
//     handleSelectStopClick,
//     toggleStopDetails,
//     handleRemoveStopClick,
//     handleDisplayNameChange,
//     handleLabelChange,
//     predictionMap,
//     handlePredictionSelect,
//     handleNotesChange,
//     handlePlaceIdChange,
//     handleTimePieceChange,
//     handleTimeClear,
//     displayNameInputRefs,
//     labelInputRefs,
//     itemRefs,
//     activeFieldRef,
// }: SortableStopItemProps) {
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//         isDragging,
//     } = useSortable({ id, disabled: detailInputsDisabled, data: { index } });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         zIndex: isDragging ? 10 : 0,
//         opacity: isDragging ? 0.8 : 1,
//     };

//     return (
//         <li
//             ref={(element) => {
//                 setNodeRef(element);
//                 itemRefs.current[index] = element;
//             }}
//             style={style}
//             className={[
//                 "to-go__item",
//                 isSelected ? "to-go__item--selected" : "",
//                 isExpanded ? "to-go__item--open" : "",
//                 isNew ? "to-go__item--draft-new" : "",
//                 isDragging ? "to-go__item--dragging" : "",
//             ]
//                 .filter(Boolean)
//                 .join(" ")}
//             {...attributes}
//         >
//             <div className="to-go__item-header">
//                 <button
//                     type="button"
//                     className="to-go__drag-handle"
//                     aria-label="Drag to reorder"
//                     {...listeners}
//                 >
//                     <span aria-hidden="true">⋮⋮</span>
//                 </button>
//                 <button
//                     type="button"
//                     className="to-go__item-select"
//                     onClick={() => handleSelectStopClick(stop, index)}
//                     aria-pressed={isSelected}
//                 >
//                     <span className="to-go__step">{rank + 1}</span>
//                     <div className="to-go__item-text">
//                         <span className="to-go__title">{displayTitle}</span>
//                         {summary ? (
//                             <span className="to-go__time-pill">{summary}</span>
//                         ) : null}
//                         {isNew ? (
//                             <span className="to-go__chip to-go__chip--new">
//                                 New
//                             </span>
//                         ) : null}
//                     </div>
//                 </button>
//                 <div className="to-go__item-actions">
//                     <button
//                         type="button"
//                         className="to-go__action to-go__action--toggle"
//                         onClick={() => toggleStopDetails(index)}
//                         aria-expanded={isExpanded}
//                     >
//                         {isExpanded ? "Hide" : "Details"}
//                     </button>
//                     <button
//                         type="button"
//                         className="to-go__action to-go__action--danger"
//                         onClick={() => handleRemoveStopClick(index)}
//                         disabled={detailInputsDisabled}
//                     >
//                         -
//                     </button>
//                 </div>
//             </div>

//             <div
//                 className={
//                     isExpanded
//                         ? "to-go__item-details to-go__item-details--open"
//                         : "to-go__item-details"
//                 }
//             >
//                 <label className="to-go__field">
//                     <span>Display name</span>
//                     <input
//                         type="text"
//                         value={stop.displayName ?? ""}
//                         onChange={(event) =>
//                             handleDisplayNameChange(index, event.target.value)
//                         }
//                         placeholder="How should we refer to this stop?"
//                         disabled={detailInputsDisabled}
//                         ref={(element) => {
//                             displayNameInputRefs.current[index] = element;
//                         }}
//                         onFocus={() => {
//                             activeFieldRef.current = {
//                                 index,
//                                 field: "display",
//                             };
//                         }}
//                     />
//                 </label>
//                 <label className="to-go__field">
//                     <span>Place name</span>
//                     <input
//                         type="text"
//                         value={stop.label}
//                         onChange={(event) =>
//                             handleLabelChange(index, event.target.value)
//                         }
//                         placeholder="Enter stop name"
//                         disabled={detailInputsDisabled}
//                         ref={(element) => {
//                             labelInputRefs.current[index] = element;
//                         }}
//                         onFocus={() => {
//                             activeFieldRef.current = {
//                                 index,
//                                 field: "label",
//                             };
//                         }}
//                     />
//                 </label>

//                 {isExpanded && (predictionMap[index]?.length ?? 0) ? (
//                     <ul className="to-go__suggestions" role="listbox">
//                         {predictionMap[index]!.map((prediction) => (
//                             <li key={prediction.place_id}>
//                                 <button
//                                     type="button"
//                                     className="to-go__suggestion"
//                                     onClick={() =>
//                                         handlePredictionSelect(
//                                             index,
//                                             prediction
//                                         )
//                                     }
//                                     disabled={detailInputsDisabled}
//                                 >
//                                     <span className="to-go__suggestion-primary">
//                                         {
//                                             prediction.structured_formatting
//                                                 .main_text
//                                         }
//                                     </span>
//                                     {prediction.structured_formatting
//                                         .secondary_text ? (
//                                         <span className="to-go__suggestion-secondary">
//                                             {
//                                                 prediction.structured_formatting
//                                                     .secondary_text
//                                             }
//                                         </span>
//                                     ) : null}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : null}

//                 <label className="to-go__field">
//                     <span>Notes</span>
//                     <textarea
//                         value={stop.notes ?? ""}
//                         onChange={(event) =>
//                             handleNotesChange(index, event.target.value)
//                         }
//                         placeholder="Add optional notes"
//                         rows={2}
//                         disabled={detailInputsDisabled}
//                     />
//                 </label>

//                 <label className="to-go__field">
//                     <span>Place ID (optional)</span>
//                     <input
//                         type="text"
//                         value={stop.placeId ?? ""}
//                         onChange={(event) =>
//                             handlePlaceIdChange(index, event.target.value)
//                         }
//                         placeholder="ChIJ..."
//                         disabled={detailInputsDisabled}
//                     />
//                 </label>

//                 <div className="to-go__field-grid">
//                     <label className="to-go__field to-go__field--compact">
//                         <span>Days</span>
//                         <input
//                             type="number"
//                             min="0"
//                             value={stop.timeToSpendDays ?? ""}
//                             onChange={(event) =>
//                                 handleTimePieceChange(
//                                     index,
//                                     "timeToSpendDays",
//                                     event.target.value
//                                 )
//                             }
//                             placeholder="0"
//                             disabled={detailInputsDisabled}
//                         />
//                     </label>
//                     <label className="to-go__field to-go__field--compact">
//                         <span>Hours</span>
//                         <input
//                             type="number"
//                             min="0"
//                             max="23"
//                             value={stop.timeToSpendHours ?? ""}
//                             onChange={(event) =>
//                                 handleTimePieceChange(
//                                     index,
//                                     "timeToSpendHours",
//                                     event.target.value
//                                 )
//                             }
//                             placeholder="0"
//                             disabled={detailInputsDisabled}
//                         />
//                     </label>
//                     <label className="to-go__field to-go__field--compact">
//                         <span>Minutes</span>
//                         <input
//                             type="number"
//                             min="0"
//                             max="59"
//                             value={stop.timeToSpendMinutes ?? ""}
//                             onChange={(event) =>
//                                 handleTimePieceChange(
//                                     index,
//                                     "timeToSpendMinutes",
//                                     event.target.value
//                                 )
//                             }
//                             placeholder="0"
//                             disabled={detailInputsDisabled}
//                         />
//                     </label>
//                     <button
//                         type="button"
//                         className="to-go__action to-go__action--ghost"
//                         onClick={() => handleTimeClear(index)}
//                         disabled={detailInputsDisabled}
//                     >
//                         Clear time
//                     </button>
//                 </div>

//                 <div className="to-go__field-grid to-go__field-grid--address">
//                     <label className="to-go__field">
//                         <span>Address</span>
//                         <input
//                             type="text"
//                             value={stop.description ?? ""}
//                             readOnly={true}
//                             placeholder="123 Example St, Vancouver, BC"
//                             disabled={detailInputsDisabled}
//                             className="to-go__field--readonly"
//                         />
//                     </label>
//                 </div>
//             </div>
//         </li>
//     );
// }

// type ToGoListProps = {
//     plan: TravelPlan | null;
//     draftStops?: PlanStop[] | null;
//     isLoading?: boolean;
//     onSelectStop?: (stop: PlanStop, index: number) => void;
//     selectedStopIndex?: number | null;
//     onAddStop?: () => void;
//     onUpdateStop?: (index: number, updates: Partial<PlanStop>) => void;
//     onRemoveStop?: (index: number) => void;
//     onMoveStop?: (fromIndex: number, toIndex: number) => void;
//     onSave?: () => void;
//     hasPendingChanges?: boolean;
// };

// const clampToRange = (value: number, min: number, max: number): number => {
//     if (Number.isNaN(value)) {
//         return min;
//     }
//     return Math.min(Math.max(value, min), max);
// };

// const normaliseTimeParts = (days: number, hours: number, minutes: number) => ({
//     timeToSpendDays: clampToRange(Math.floor(days), 0, 365),
//     timeToSpendHours: clampToRange(Math.floor(hours), 0, 23),
//     timeToSpendMinutes: clampToRange(Math.floor(minutes), 0, 59),
// });

// const durationLabel = (stop: PlanStop): string | null => {
//     const tokens: string[] = [];
//     if (typeof stop.timeToSpendDays === "number" && stop.timeToSpendDays > 0) {
//         tokens.push(`${stop.timeToSpendDays}d`);
//     }
//     if (
//         typeof stop.timeToSpendHours === "number" &&
//         stop.timeToSpendHours > 0
//     ) {
//         tokens.push(`${stop.timeToSpendHours}h`);
//     }
//     if (
//         typeof stop.timeToSpendMinutes === "number" &&
//         stop.timeToSpendMinutes > 0
//     ) {
//         tokens.push(`${stop.timeToSpendMinutes}m`);
//     }
//     if (!tokens.length) {
//         return null;
//     }
//     return tokens.join(" ");
// };

// function ToGoList({
//     plan,
//     draftStops = null,
//     isLoading = false,
//     onSelectStop,
//     selectedStopIndex = null,
//     onAddStop,
//     onUpdateStop,
//     onRemoveStop,
//     onMoveStop,
//     onSave,
//     hasPendingChanges: externalHasPendingChanges = false,
// }: ToGoListProps) {
//     const formStops = draftStops ?? plan?.stops ?? [];
//     const isEditable = Boolean(onUpdateStop);
//     // Local state to track whether there are pending changes from reordering
//     const [localHasPendingChanges, setLocalHasPendingChanges] = useState(false);
//     // Combine external and local pending changes
//     const effectiveHasPendingChanges =
//         externalHasPendingChanges || localHasPendingChanges;
//     // const isEditable = true;
//     const [expandedStops, setExpandedStops] = useState<Record<number, boolean>>(
//         {}
//     );
//     const previousCountRef = useRef(formStops.length);
//     const listRef = useRef<HTMLOListElement | null>(null);
//     const displayNameInputRefs = useRef<(HTMLInputElement | null)[]>([]);
//     const labelInputRefs = useRef<(HTMLInputElement | null)[]>([]);
//     const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
//     const pendingFocusIndexRef = useRef<number | null>(null);
//     const activeFieldRef = useRef<{
//         index: number;
//         field: "display" | "label";
//     } | null>(null);
//     const autocompleteServiceRef =
//         useRef<google.maps.places.AutocompleteService | null>(null);
//     const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
//         null
//     );
//     const predictionStoreRef = useRef<
//         Record<number, google.maps.places.AutocompletePrediction[]>
//     >({});
//     const [predictionTick, setPredictionTick] = useState(0);
//     const requestIdRef = useRef(0);
//     const loaderRef = useRef<Loader | null>(null);
//     const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//     const pointerSensor = useSensor(PointerSensor, {
//         // Reduce the distance required to initiate a drag
//         activationConstraint: { distance: 1 },
//     });
//     const keyboardSensor = useSensor(KeyboardSensor, {
//         coordinateGetter: sortableKeyboardCoordinates,
//     });
//     const sensors = useSensors(pointerSensor, keyboardSensor);

//     const remapIndexAfterRemoval = (
//         currentIndex: number,
//         removedIndex: number
//     ) => (currentIndex > removedIndex ? currentIndex - 1 : currentIndex);

//     useEffect(() => {
//         setExpandedStops({});
//         previousCountRef.current = formStops.length;
//         displayNameInputRefs.current = [];
//         itemRefs.current = [];
//         pendingFocusIndexRef.current = null;
//     }, [plan?.id]);

//     useEffect(() => {
//         if (formStops.length > previousCountRef.current) {
//             const newIndex = formStops.length - 1;
//             pendingFocusIndexRef.current = newIndex;
//             // When a new stop is added, collapse any other expanded stops
//             // and only expand the newly-added stop.
//             setExpandedStops(() => ({ [newIndex]: true }));
//         }
//         previousCountRef.current = formStops.length;
//     }, [formStops.length, formStops]);

//     useEffect(() => {
//         const index = pendingFocusIndexRef.current;
//         if (index === null) {
//             return;
//         }
//         const targetInput = displayNameInputRefs.current[index];
//         const targetItem = itemRefs.current[index];
//         const targetElement = targetInput ?? targetItem ?? null;

//         if (targetInput) {
//             targetInput.focus();
//             targetInput.select();
//         }

//         const listElement = listRef.current;
//         if (targetElement && listElement) {
//             const elementOffset = targetElement.offsetTop;
//             const desiredTop = Math.max(
//                 0,
//                 elementOffset - listElement.clientHeight * 0.25
//             );
//             listElement.scrollTo({
//                 top: desiredTop,
//                 behavior: "smooth",
//             });
//         } else if (targetElement) {
//             targetElement.scrollIntoView({
//                 behavior: "smooth",
//                 block: "nearest",
//                 inline: "nearest",
//             });
//         }

//         pendingFocusIndexRef.current = null;
//         activeFieldRef.current = { index, field: "display" };
//     }, [formStops, expandedStops]);

//     useEffect(() => {
//         if (pendingFocusIndexRef.current !== null) {
//             return;
//         }
//         const active = activeFieldRef.current;
//         if (!active) {
//             return;
//         }
//         const target =
//             active.field === "display"
//                 ? displayNameInputRefs.current[active.index]
//                 : labelInputRefs.current[active.index];
//         if (target && document.activeElement !== target) {
//             const { value } = target;
//             const cursor = typeof value === "string" ? value.length : 0;
//             target.focus({ preventScroll: true });
//             try {
//                 target.setSelectionRange(cursor, cursor);
//             } catch (error) {
//                 // ignore selection errors on unfocusable inputs
//             }
//         }
//     }, [formStops, expandedStops]);

//     useEffect(() => {
//         if (displayNameInputRefs.current.length > formStops.length) {
//             displayNameInputRefs.current.length = formStops.length;
//         }
//         if (labelInputRefs.current.length > formStops.length) {
//             labelInputRefs.current.length = formStops.length;
//         }
//         if (itemRefs.current.length > formStops.length) {
//             itemRefs.current.length = formStops.length;
//         }
//     }, [formStops.length]);

//     const durationSummaries = useMemo(
//         () => formStops.map((stop) => durationLabel(stop)),
//         [formStops]
//     );

//     // Always enable drag per user request
//     const enableDrag = Boolean(onMoveStop && isEditable && formStops.length > 1);

//     // Display order: list of indices referencing formStops
//     const [displayOrder, setDisplayOrder] = useState<number[]>([]);

//     // Initialize or sync display order when stops change in size/content
//     useEffect(() => {
//         const n = formStops.length;
//         // if length changed or displayOrder doesn't match, reset to identity
//         if (displayOrder.length !== n) {
//             setDisplayOrder(Array.from({ length: n }, (_, i) => i));
//             return;
//         }
//         // If items changed identity (e.g., new plan), also reset
//         // We check by comparing labels/placeIds shallowly
//         const identityChanged = displayOrder.some((di, pos) => {
//             const stop = formStops[di];
//             const expected = formStops[pos];
//             return (
//                 (stop?.placeId ?? stop?.label ?? di) !==
//                 (expected?.placeId ?? expected?.label ?? pos)
//             );
//         });
//         if (identityChanged) {
//             setDisplayOrder(Array.from({ length: n }, (_, i) => i));
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [formStops]);

//     // Sortable ids are generated from display indices to keep them stable
//     const sortableIds = useMemo(() => {
//         const order =
//             displayOrder.length === formStops.length
//                 ? displayOrder
//                 : Array.from({ length: formStops.length }, (_, idx) => idx);
//         return order.map((di) => `stop-${di}`);
//     }, [displayOrder, formStops.length]);

//     const predictionMap = useMemo(
//         () => predictionStoreRef.current,
//         [predictionTick]
//     );

//     const canSave = Boolean(isEditable && onSave && effectiveHasPendingChanges);
//     const showUnsavedBadge = Boolean(isEditable && effectiveHasPendingChanges);
//     const inputsDisabled = !isEditable;

//     const toggleStopDetails = (index: number) => {
//         setExpandedStops((prev) => {
//             const isOpen = !prev[index];
//             if (!isOpen && predictionStoreRef.current[index]) {
//                 const next = { ...predictionStoreRef.current };
//                 delete next[index];
//                 predictionStoreRef.current = next;
//                 setPredictionTick((tick) => tick + 1);
//             }
//             return { ...prev, [index]: isOpen };
//         });
//     };

//     const handleLabelChange = (index: number, value: string) => {
//         const currentStop = formStops[index];
//         const trimmed = value;
//         const updates: Partial<PlanStop> = { label: trimmed };
//         const currentDisplay = currentStop?.displayName?.trim() ?? "";
//         const currentLabel = currentStop?.label ?? "";
//         if (!currentDisplay || currentDisplay === currentLabel) {
//             updates.displayName = trimmed;
//         }
//         onUpdateStop?.(index, updates);
//         fetchPredictions(index, value);
//     };

//     const handleDisplayNameChange = (index: number, value: string) => {
//         // Preserve spaces the user types (including internal and trailing spaces)
//         // so the input feels natural. Only collapse to undefined when the
//         // string is empty. Trimming for storage can be handled on save/blurs.
//         onUpdateStop?.(index, {
//             displayName: value.length ? value : undefined,
//         });
//     };

//     const handleNotesChange = (index: number, value: string) => {
//         onUpdateStop?.(index, { notes: value.length ? value : "" });
//     };

//     const handlePlaceIdChange = (index: number, value: string) => {
//         const trimmed = value.trim();
//         onUpdateStop?.(index, { placeId: trimmed || undefined });
//     };

//     const handleTimePieceChange = (
//         index: number,
//         field: "timeToSpendDays" | "timeToSpendHours" | "timeToSpendMinutes",
//         rawValue: string
//     ) => {
//         if (!isEditable) {
//             return;
//         }
//         const parsed = Number(rawValue);
//         if (Number.isNaN(parsed) || parsed < 0) {
//             return;
//         }

//         const stop = formStops[index];
//         if (!stop) {
//             return;
//         }

//         const nextValues = normaliseTimeParts(
//             field === "timeToSpendDays" ? parsed : stop.timeToSpendDays ?? 0,
//             field === "timeToSpendHours" ? parsed : stop.timeToSpendHours ?? 0,
//             field === "timeToSpendMinutes"
//                 ? parsed
//                 : stop.timeToSpendMinutes ?? 0
//         );

//         onUpdateStop?.(index, nextValues);
//     };

//     const handleTimeClear = (index: number) => {
//         if (!isEditable) {
//             return;
//         }
//         onUpdateStop?.(index, {
//             timeToSpendDays: undefined,
//             timeToSpendHours: undefined,
//             timeToSpendMinutes: undefined,
//         });
//     };

//     const handleSaveClick = () => {
//         if (!canSave) {
//             return;
//         }
//         // When saving, reset our local pending changes flag
//         setLocalHasPendingChanges(false);
//         onSave?.();
//         // Collapse any open stop details after saving
//         setExpandedStops({});
//     };

//     const handleAddStopClick = () => {
//         if (!isEditable || !onAddStop) {
//             return;
//         }
//         onAddStop();
//     };

//     const handleRemoveStopClick = (index: number) => {
//         if (!isEditable || !onRemoveStop) {
//             return;
//         }
//         onRemoveStop(index);
//         setExpandedStops((prev) => {
//             const next: Record<number, boolean> = {};
//             Object.entries(prev).forEach(([key, value]) => {
//                 const currentIndex = Number(key);
//                 if (currentIndex === index) {
//                     return;
//                 }
//                 const newIndex = remapIndexAfterRemoval(currentIndex, index);
//                 if (value) {
//                     next[newIndex] = true;
//                 }
//             });
//             return next;
//         });
//         const nextPredictionStore: Record<
//             number,
//             google.maps.places.AutocompletePrediction[]
//         > = {};
//         Object.entries(predictionStoreRef.current).forEach(([key, value]) => {
//             const currentIndex = Number(key);
//             if (currentIndex === index) {
//                 return;
//             }
//             const newIndex = remapIndexAfterRemoval(currentIndex, index);
//             nextPredictionStore[newIndex] = value;
//         });
//         predictionStoreRef.current = nextPredictionStore;
//         setPredictionTick((tick) => tick + 1);
//     };

//     const handleSelectStopClick = (stop: PlanStop, index: number) => {
//         onSelectStop?.(stop, index);
//     };

//     const handleDragEnd = (event: DragEndEvent) => {
//         const { active, over } = event;
//         if (!over) {
//             return;
//         }

//         const fromRank = sortableIds.indexOf(String(active.id));
//         const toRank = sortableIds.indexOf(String(over.id));

//         if (fromRank === -1 || toRank === -1 || fromRank === toRank) {
//             return;
//         }

//         const currentOrder =
//             displayOrder.length === formStops.length
//                 ? displayOrder
//                 : Array.from({ length: formStops.length }, (_, idx) => idx);
//         const sourceIndex = currentOrder[fromRank];
//         const destinationIndex = currentOrder[toRank];

//         // Update focus tracking
//         if (
//             activeFieldRef.current &&
//             activeFieldRef.current.index === sourceIndex
//         ) {
//             activeFieldRef.current = {
//                 index: destinationIndex,
//                 field: activeFieldRef.current.field,
//             };
//             pendingFocusIndexRef.current = destinationIndex;
//         }

//         // Also update expanded stops state
//         setExpandedStops((prevExpanded) => {
//             const newExpanded = { ...prevExpanded };

//             // If dragged item was expanded, it should remain expanded at new position
//             if (prevExpanded[fromRank]) {
//                 delete newExpanded[fromRank];
//                 newExpanded[toRank] = true;
//             }

//             // Shift other expanded items as needed
//             Object.keys(prevExpanded).forEach((key) => {
//                 const idx = parseInt(key);
//                 if (idx === fromRank) return; // Already handled

//                 // Shift indices for items between source and destination
//                 if (fromRank < toRank) {
//                     // Moving down
//                     if (idx > fromRank && idx <= toRank) {
//                         // Shift up by 1
//                         delete newExpanded[idx];
//                         newExpanded[idx - 1] = true;
//                     }
//                 } else {
//                     // Moving up
//                     if (idx < fromRank && idx >= toRank) {
//                         // Shift down by 1
//                         delete newExpanded[idx];
//                         newExpanded[idx + 1] = true;
//                     }
//                 }
//             });

//             return newExpanded;
//         });

//         setDisplayOrder((prev) => {
//             const baseOrder =
//                 prev.length === formStops.length
//                     ? [...prev]
//                     : currentOrder;
//             const movedIndex = baseOrder.splice(fromRank, 1)[0];
//             baseOrder.splice(toRank, 0, movedIndex);
//             return baseOrder;
//         });

//         // Mark that we have pending changes that need to be saved
//         setLocalHasPendingChanges(true);

//         // If parent provided handler, call it
//         if (onMoveStop) {
//             onMoveStop(sourceIndex, destinationIndex);
//         }
//     };

//     useEffect(() => {
//         if (
//             !mapsApiKey ||
//             autocompleteServiceRef.current ||
//             typeof window === "undefined"
//         ) {
//             return;
//         }

//         const loader = (loaderRef.current ??= new Loader({
//             apiKey: mapsApiKey,
//             version: "weekly",
//             libraries: ["places", "marker"],
//         }));

//         let cancelled = false;
//         loader
//             .load()
//             .then((google) => {
//                 if (cancelled) {
//                     return;
//                 }
//                 autocompleteServiceRef.current =
//                     new google.maps.places.AutocompleteService();
//                 placesServiceRef.current = new google.maps.places.PlacesService(
//                     document.createElement("div")
//                 );
//             })
//             .catch(() => {
//                 autocompleteServiceRef.current = null;
//                 placesServiceRef.current = null;
//             });

//         return () => {
//             cancelled = true;
//         };
//     }, [mapsApiKey]);

//     const updatePredictions = (
//         index: number,
//         values: google.maps.places.AutocompletePrediction[] | null
//     ) => {
//         if (!values || !values.length) {
//             if (predictionStoreRef.current[index]) {
//                 const next = { ...predictionStoreRef.current };
//                 delete next[index];
//                 predictionStoreRef.current = next;
//                 setPredictionTick((tick) => tick + 1);
//             }
//             return;
//         }

//         predictionStoreRef.current = {
//             ...predictionStoreRef.current,
//             [index]: values,
//         };
//         setPredictionTick((tick) => tick + 1);
//     };

//     const fetchPredictions = (index: number, input: string) => {
//         if (!autocompleteServiceRef.current || !input.trim()) {
//             updatePredictions(index, null);
//             return;
//         }

//         const currentRequest = ++requestIdRef.current;
//         autocompleteServiceRef.current.getPlacePredictions(
//             {
//                 input,
//                 componentRestrictions: { country: "CA" },
//                 bounds: new google.maps.LatLngBounds(
//                     { lat: 48.18, lng: -139.06 }, // southwest corner near Vancouver Island edge
//                     { lat: 60.0, lng: -114.05 } // northeast corner near BC/Yukon border
//                 ),
//             },
//             (predictions) => {
//                 if (currentRequest !== requestIdRef.current) {
//                     return;
//                 }
//                 if (!predictions || !predictions.length) {
//                     updatePredictions(index, null);
//                 } else {
//                     updatePredictions(index, predictions);
//                 }
//             }
//         );
//     };

//     const handlePredictionSelect = (
//         index: number,
//         prediction: google.maps.places.AutocompletePrediction
//     ) => {
//         updatePredictions(index, null);

//         const existingStop = formStops[index];
//         const applySelection = (data: Partial<PlanStop>) => {
//             const resolvedLabel =
//                 data.label ?? prediction.structured_formatting.main_text;
//             const resolvedDisplay =
//                 existingStop?.displayName && existingStop.displayName.trim()
//                     ? existingStop.displayName
//                     : data.displayName ??
//                       resolvedLabel ??
//                       prediction.description;
//             onUpdateStop?.(index, {
//                 label: resolvedLabel,
//                 displayName: resolvedDisplay ?? resolvedLabel,
//                 description:
//                     data.description ??
//                     prediction.structured_formatting.secondary_text ??
//                     prediction.description,
//                 placeId: data.placeId ?? prediction.place_id,
//                 latitude: data.latitude,
//                 longitude: data.longitude,
//             });
//         };

//         if (!placesServiceRef.current) {
//             applySelection({});
//             return;
//         }

//         placesServiceRef.current.getDetails(
//             {
//                 placeId: prediction.place_id,
//                 fields: ["name", "formatted_address", "geometry", "place_id"],
//             },
//             (result, status) => {
//                 if (
//                     status !== google.maps.places.PlacesServiceStatus.OK ||
//                     !result
//                 ) {
//                     applySelection({});
//                     return;
//                 }

//                 applySelection({
//                     label: result.name ?? undefined,
//                     displayName: result.name ?? undefined,
//                     description: result.formatted_address ?? undefined,
//                     placeId: result.place_id ?? undefined,
//                     latitude: result.geometry?.location?.lat(),
//                     longitude: result.geometry?.location?.lng(),
//                 });
//             }
//         );
//     };

//     return (
//         <section className="to-go">
//             <header className="to-go__header">
//                 <div className="to-go__header-row">
//                     <div>
//                         <p className="to-go__eyebrow">To Go</p>
//                         <h3>
//                             {plan
//                                 ? "Upcoming stops"
//                                 : "Pick a plan to see your route"}
//                         </h3>
//                     </div>
//                     <div className="to-go__header-actions">
//                         {showUnsavedBadge ? (
//                             <span className="to-go__draft-indicator">
//                                 Unsaved changes
//                             </span>
//                         ) : null}
//                         <button
//                             type="button"
//                             className="to-go__button"
//                             onClick={handleSaveClick}
//                             disabled={!canSave}
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>
//                 <button
//                     type="button"
//                     className="to-go__button to-go__button--secondary full-width"
//                     onClick={handleAddStopClick}
//                     disabled={!isEditable}
//                 >
//                     Add Stop
//                 </button>
//             </header>

//             {/* Debug info - adding debug logging here */}
//             {enableDrag ? (
//                 <DndContext
//                     sensors={sensors}
//                     modifiers={[restrictToVerticalAxis]}
//                     onDragEnd={handleDragEnd}
//                     // Add additional props to improve dragging experience
//                     autoScroll={true}
//                 >
//                     <SortableContext
//                         items={sortableIds}
//                         strategy={verticalListSortingStrategy}
//                     >
//                         <ol className="to-go__list" ref={listRef}>
//                             {isLoading ? (
//                                 <li className="to-go__empty">
//                                     Loading your stops…
//                                 </li>
//                             ) : formStops.length ? (
//                                 (displayOrder.length === formStops.length
//                                     ? displayOrder
//                                     : Array.from(
//                                           { length: formStops.length },
//                                           (_, idx) => idx
//                                       )
//                                 ).map((displayIndex, rank) => {
//                                     const stop = formStops[displayIndex];
//                                     const isSelected =
//                                         selectedStopIndex === displayIndex;
//                                     const isExpanded =
//                                         expandedStops[displayIndex] ?? false;
//                                     const summary =
//                                         durationSummaries[displayIndex];
//                                     const isNew =
//                                         typeof stop.__originalIndex !==
//                                         "number";
//                                     const displayTitle =
//                                         (
//                                             stop.displayName ??
//                                             stop.label ??
//                                             ""
//                                         ).trim() || "Untitled stop";
//                                     const detailInputsDisabled = inputsDisabled;

//                                     return (
//                                         <SortableStopItem
//                                             key={`${plan?.id ?? "plan"}-${
//                                                 stop.__originalIndex ??
//                                                 stop.placeId ??
//                                                 `${displayIndex}-${stop.label}`
//                                             }`}
//                                             id={sortableIds[rank]}
//                                             index={displayIndex}
//                                             rank={rank}
//                                             stop={stop}
//                                             isSelected={isSelected}
//                                             isExpanded={isExpanded}
//                                             summary={summary}
//                                             isNew={isNew}
//                                             displayTitle={displayTitle}
//                                             detailInputsDisabled={
//                                                 detailInputsDisabled
//                                             }
//                                             handleSelectStopClick={
//                                                 handleSelectStopClick
//                                             }
//                                             toggleStopDetails={
//                                                 toggleStopDetails
//                                             }
//                                             handleRemoveStopClick={
//                                                 handleRemoveStopClick
//                                             }
//                                             handleDisplayNameChange={
//                                                 handleDisplayNameChange
//                                             }
//                                             handleLabelChange={
//                                                 handleLabelChange
//                                             }
//                                             predictionMap={predictionMap}
//                                             handlePredictionSelect={
//                                                 handlePredictionSelect
//                                             }
//                                             handleNotesChange={
//                                                 handleNotesChange
//                                             }
//                                             handlePlaceIdChange={
//                                                 handlePlaceIdChange
//                                             }
//                                             handleTimePieceChange={
//                                                 handleTimePieceChange
//                                             }
//                                             handleTimeClear={handleTimeClear}
//                                             displayNameInputRefs={
//                                                 displayNameInputRefs
//                                             }
//                                             labelInputRefs={labelInputRefs}
//                                             itemRefs={itemRefs}
//                                             activeFieldRef={activeFieldRef}
//                                         />
//                                     );
//                                 })
//                             ) : (
//                                 <li className="to-go__empty">
//                                     <p>
//                                         No stops yet. Start building your
//                                         itinerary.
//                                     </p>
//                                     <button
//                                         type="button"
//                                         className="to-go__button to-go__button--secondary"
//                                         onClick={handleAddStopClick}
//                                         disabled={!isEditable}
//                                     >
//                                         Add the first stop
//                                     </button>
//                                 </li>
//                             )}
//                         </ol>
//                     </SortableContext>
//                 </DndContext>
//             ) : (
//                 <ol className="to-go__list" ref={listRef}>
//                     {isLoading ? (
//                         <li className="to-go__empty">Loading your stops…</li>
//                     ) : formStops.length ? (
//                         formStops.map((stop, index) => {
//                             const isSelected = selectedStopIndex === index;
//                             const isExpanded = expandedStops[index] ?? false;
//                             const summary = durationSummaries[index];
//                             const isNew =
//                                 typeof stop.__originalIndex !== "number";
//                             const displayTitle =
//                                 (stop.displayName ?? stop.label ?? "").trim() ||
//                                 "Untitled stop";
//                             const detailInputsDisabled = inputsDisabled;

//                             return (
//                                 <li
//                                     key={`${plan?.id ?? "plan"}-${
//                                         stop.__originalIndex ??
//                                         stop.placeId ??
//                                         `${index}-${stop.label}`
//                                     }`}
//                                     ref={(element) => {
//                                         itemRefs.current[index] = element;
//                                     }}
//                                     className={[
//                                         "to-go__item",
//                                         isSelected
//                                             ? "to-go__item--selected"
//                                             : "",
//                                         isExpanded ? "to-go__item--open" : "",
//                                         isNew ? "to-go__item--draft-new" : "",
//                                     ]
//                                         .filter(Boolean)
//                                         .join(" ")}
//                                 >
//                                     <div className="to-go__item-header">
//                                         <button
//                                             type="button"
//                                             className="to-go__item-select"
//                                             onClick={() =>
//                                                 handleSelectStopClick(
//                                                     stop,
//                                                     index
//                                                 )
//                                             }
//                                             aria-pressed={isSelected}
//                                         >
//                                             <span className="to-go__step">
//                                                 {index + 1}
//                                             </span>
//                                             <div className="to-go__item-text">
//                                                 <span className="to-go__title">
//                                                     {displayTitle}
//                                                 </span>
//                                                 {summary ? (
//                                                     <span className="to-go__time-pill">
//                                                         {summary}
//                                                     </span>
//                                                 ) : null}
//                                                 {isNew ? (
//                                                     <span className="to-go__chip to-go__chip--new">
//                                                         New
//                                                     </span>
//                                                 ) : null}
//                                             </div>
//                                         </button>
//                                         <div className="to-go__item-actions">
//                                             <button
//                                                 type="button"
//                                                 className="to-go__action to-go__action--toggle"
//                                                 onClick={() =>
//                                                     toggleStopDetails(index)
//                                                 }
//                                                 aria-expanded={isExpanded}
//                                             >
//                                                 {isExpanded
//                                                     ? "Hide"
//                                                     : "Details"}
//                                             </button>
//                                             <button
//                                                 type="button"
//                                                 className="to-go__action to-go__action--danger"
//                                                 onClick={() =>
//                                                     handleRemoveStopClick(index)
//                                                 }
//                                                 disabled={inputsDisabled}
//                                             >
//                                                 -
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div
//                                         className={
//                                             isExpanded
//                                                 ? "to-go__item-details to-go__item-details--open"
//                                                 : "to-go__item-details"
//                                         }
//                                     >
//                                         {/* Details content same as in SortableStopItem */}
//                                         <label className="to-go__field">
//                                             <span>Display name</span>
//                                             <input
//                                                 type="text"
//                                                 value={stop.displayName ?? ""}
//                                                 onChange={(event) =>
//                                                     handleDisplayNameChange(
//                                                         index,
//                                                         event.target.value
//                                                     )
//                                                 }
//                                                 placeholder="How should we refer to this stop?"
//                                                 disabled={detailInputsDisabled}
//                                                 ref={(element) => {
//                                                     displayNameInputRefs.current[
//                                                         index
//                                                     ] = element;
//                                                 }}
//                                                 onFocus={() => {
//                                                     activeFieldRef.current = {
//                                                         index,
//                                                         field: "display",
//                                                     };
//                                                 }}
//                                             />
//                                         </label>
//                                         <label className="to-go__field">
//                                             <span>Place name</span>
//                                             <input
//                                                 type="text"
//                                                 value={stop.label}
//                                                 onChange={(event) =>
//                                                     handleLabelChange(
//                                                         index,
//                                                         event.target.value
//                                                     )
//                                                 }
//                                                 placeholder="Enter stop name"
//                                                 disabled={detailInputsDisabled}
//                                                 ref={(element) => {
//                                                     labelInputRefs.current[
//                                                         index
//                                                     ] = element;
//                                                 }}
//                                                 onFocus={() => {
//                                                     activeFieldRef.current = {
//                                                         index,
//                                                         field: "label",
//                                                     };
//                                                 }}
//                                             />
//                                         </label>

//                                         {isExpanded &&
//                                         (predictionMap[index]?.length ?? 0) ? (
//                                             <ul
//                                                 className="to-go__suggestions"
//                                                 role="listbox"
//                                             >
//                                                 {predictionMap[index]!.map(
//                                                     (prediction) => (
//                                                         <li
//                                                             key={
//                                                                 prediction.place_id
//                                                             }
//                                                         >
//                                                             <button
//                                                                 type="button"
//                                                                 className="to-go__suggestion"
//                                                                 onClick={() =>
//                                                                     handlePredictionSelect(
//                                                                         index,
//                                                                         prediction
//                                                                     )
//                                                                 }
//                                                                 disabled={
//                                                                     detailInputsDisabled
//                                                                 }
//                                                             >
//                                                                 <span className="to-go__suggestion-primary">
//                                                                     {
//                                                                         prediction
//                                                                             .structured_formatting
//                                                                             .main_text
//                                                                     }
//                                                                 </span>
//                                                                 {prediction
//                                                                     .structured_formatting
//                                                                     .secondary_text ? (
//                                                                     <span className="to-go__suggestion-secondary">
//                                                                         {
//                                                                             prediction
//                                                                                 .structured_formatting
//                                                                                 .secondary_text
//                                                                         }
//                                                                     </span>
//                                                                 ) : null}
//                                                             </button>
//                                                         </li>
//                                                     )
//                                                 )}
//                                             </ul>
//                                         ) : null}

//                                         <label className="to-go__field">
//                                             <span>Notes</span>
//                                             <textarea
//                                                 value={stop.notes ?? ""}
//                                                 onChange={(event) =>
//                                                     handleNotesChange(
//                                                         index,
//                                                         event.target.value
//                                                     )
//                                                 }
//                                                 placeholder="Add optional notes"
//                                                 rows={2}
//                                                 disabled={detailInputsDisabled}
//                                             />
//                                         </label>

//                                         <label className="to-go__field">
//                                             <span>Place ID (optional)</span>
//                                             <input
//                                                 type="text"
//                                                 value={stop.placeId ?? ""}
//                                                 onChange={(event) =>
//                                                     handlePlaceIdChange(
//                                                         index,
//                                                         event.target.value
//                                                     )
//                                                 }
//                                                 placeholder="ChIJ..."
//                                                 disabled={detailInputsDisabled}
//                                             />
//                                         </label>

//                                         <div className="to-go__field-grid">
//                                             <label className="to-go__field to-go__field--compact">
//                                                 <span>Days</span>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     value={
//                                                         stop.timeToSpendDays ??
//                                                         ""
//                                                     }
//                                                     onChange={(event) =>
//                                                         handleTimePieceChange(
//                                                             index,
//                                                             "timeToSpendDays",
//                                                             event.target.value
//                                                         )
//                                                     }
//                                                     placeholder="0"
//                                                     disabled={
//                                                         detailInputsDisabled
//                                                     }
//                                                 />
//                                             </label>
//                                             <label className="to-go__field to-go__field--compact">
//                                                 <span>Hours</span>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max="23"
//                                                     value={
//                                                         stop.timeToSpendHours ??
//                                                         ""
//                                                     }
//                                                     onChange={(event) =>
//                                                         handleTimePieceChange(
//                                                             index,
//                                                             "timeToSpendHours",
//                                                             event.target.value
//                                                         )
//                                                     }
//                                                     placeholder="0"
//                                                     disabled={
//                                                         detailInputsDisabled
//                                                     }
//                                                 />
//                                             </label>
//                                             <label className="to-go__field to-go__field--compact">
//                                                 <span>Minutes</span>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     max="59"
//                                                     value={
//                                                         stop.timeToSpendMinutes ??
//                                                         ""
//                                                     }
//                                                     onChange={(event) =>
//                                                         handleTimePieceChange(
//                                                             index,
//                                                             "timeToSpendMinutes",
//                                                             event.target.value
//                                                         )
//                                                     }
//                                                     placeholder="0"
//                                                     disabled={
//                                                         detailInputsDisabled
//                                                     }
//                                                 />
//                                             </label>
//                                             <button
//                                                 type="button"
//                                                 className="to-go__action to-go__action--ghost"
//                                                 onClick={() =>
//                                                     handleTimeClear(index)
//                                                 }
//                                                 disabled={detailInputsDisabled}
//                                             >
//                                                 Clear time
//                                             </button>
//                                         </div>

//                                         <div className="to-go__field-grid to-go__field-grid--address">
//                                             <label className="to-go__field">
//                                                 <span>Address</span>
//                                                 <input
//                                                     type="text"
//                                                     value={
//                                                         stop.description ?? ""
//                                                     }
//                                                     readOnly={true}
//                                                     placeholder="123 Example St, Vancouver, BC"
//                                                     disabled={
//                                                         detailInputsDisabled
//                                                     }
//                                                     className="to-go__field--readonly"
//                                                 />
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </li>
//                             );
//                         })
//                     ) : (
//                         <li className="to-go__empty">
//                             <p>No stops yet. Start building your itinerary.</p>
//                             <button
//                                 type="button"
//                                 className="to-go__button to-go__button--secondary"
//                                 onClick={handleAddStopClick}
//                                 disabled={!isEditable}
//                             >
//                                 Add the first stop
//                             </button>
//                         </li>
//                     )}
//                 </ol>
//             )}
//         </section>
//     );
// }

// export default ToGoList;
