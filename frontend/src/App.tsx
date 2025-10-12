import {
    MutableRefObject,
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import MapView from "./components/MapView";
import InfoPanel from "./components/InfoPanel";
import TripAdvisor from "./components/TripAdvisor";
import AiAssistantPanel from "./components/AiAssistantPanel";
import ToGoList from "./components/ToGoList";
import PlanManager from "./components/PlanManager";
import AdminPanel from "./components/AdminPanel";
import "./App.css";
import AuthPage from "./components/AuthPage";

export type PlanStop = {
    label: string;
    description?: string;
    placeId?: string;
    latitude?: number;
    longitude?: number;
    timeToSpendDays?: number;
    timeToSpendHours?: number;
    timeToSpendMinutes?: number;
    __originalIndex?: number;
};

export type TravelPlan = {
    id: string;
    title: string;
    summary: string;
    stops: PlanStop[];
    createdAt: string;
};

type InsertStopOptions = {
    index?: number;
    select?: boolean;
};

type PlansResponse = {
    options: TravelPlanResponse[];
};

type TravelPlanResponse = {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    stops: PlanStopResponse[];
};

type PlanStopResponse = {
    label: string;
    description?: string | null;
    placeId?: string | null;
    place_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    timeToSpendDays?: number | null;
    timeToSpendHours?: number | null;
    timeToSpendMinutes?: number | null;
};

export type TripAdvisorSuggestion = {
    name: string;
    rating?: number;
    totalRatings?: number;
    address?: string;
    priceLevel?: number;
    openNow?: boolean;
    types: string[];
    placeId?: string;
    latitude?: number;
    longitude?: number;
};

type LocationSearchResult = {
    label: string;
    address?: string | null;
    placeId?: string | null;
    latitude: number;
    longitude: number;
};

export type TripAdvisorInfo = {
    id: string;
    name: string;
    city?: string;
    country?: string;
    address?: string;
    summary?: string;
    nearbyRestaurants: TripAdvisorSuggestion[];
    nearbyHotels: TripAdvisorSuggestion[];
    nearbyAttractions: TripAdvisorSuggestion[];
    latitude?: number;
    longitude?: number;
};

export type RouteSegment = {
    fromIndex: number;
    toIndex: number;
    mode: string;
    durationText?: string;
    distanceText?: string;
    instructions?: string;
    agency?: string;
    lineName?: string;
};

export type Folder = {
    id: string;
    name: string;
    planIds: string[];
};

const FOLDER_STORAGE_PREFIX = "plan-folders";

function folderStorageKey(email: string | null): string {
    return email ? `${FOLDER_STORAGE_PREFIX}:${email}` : `${FOLDER_STORAGE_PREFIX}:guest`;
}

function loadStoredFolders(email: string | null): Folder[] {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(folderStorageKey(email));
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        const folders: Folder[] = [];
        parsed.forEach((item) => {
            if (
                item &&
                typeof item === "object" &&
                typeof item.id === "string" &&
                item.id !== "all" &&
                typeof item.name === "string" &&
                Array.isArray(item.planIds)
            ) {
                const planIds = item.planIds.filter(
                    (value: unknown): value is string => typeof value === "string"
                );
                folders.push({ id: item.id, name: item.name, planIds });
            }
        });
        return folders;
    } catch {
        return [];
    }
}

function saveStoredFolders(email: string | null, folders: Folder[]): void {
    if (typeof window === "undefined") {
        return;
    }
    try {
        const payload = folders
            .filter((folder) => folder.id !== "all")
            .map((folder) => ({
                id: folder.id,
                name: folder.name,
                planIds: folder.planIds,
            }));
        window.localStorage.setItem(
            folderStorageKey(email),
            JSON.stringify(payload)
        );
    } catch {
        // ignore storage errors
    }
}

export type UserProfile = {
    name: string;
    email: string;
};

type MapRouteResponse = {
    plan_id: string;
    polyline: string;
    warnings: string[];
    segments: RouteSegmentResponse[];
};

type RouteSegmentResponse = {
    from_index: number;
    to_index: number;
    mode: string;
    duration_text?: string;
    distance_text?: string;
    instructions?: string;
    agency?: string;
    line_name?: string;
};

type MultiLegLegResponse = {
    from_index: number;
    to_index: number;
    polyline: string;
    warnings?: string[];
    segments?: RouteSegmentResponse[];
};

type MultiLegRouteResponse = {
    plan_id: string;
    legs: MultiLegLegResponse[];
};

type MapMode = "single" | "multileg";

type TripAdvisorResponsePayload = {
    info: {
        id: string;
        name: string;
        city?: string;
        country?: string;
        address?: string;
        summary?: string;
        nearby_restaurants: TripAdvisorSuggestionPayload[];
        nearby_hotels: TripAdvisorSuggestionPayload[];
        nearby_attractions: TripAdvisorSuggestionPayload[];
        coordinates: { latitude: number; longitude: number };
    };
};

type TripAdvisorSuggestionPayload = {
    name: string;
    rating?: number;
    total_ratings?: number;
    address?: string;
    price_level?: number;
    open_now?: boolean;
    types?: string[];
    place_id?: string;
    latitude?: number;
    longitude?: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function decodeJwtEmail(token: string | null): string | null {
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return typeof payload?.sub === "string" ? payload.sub : null;
    } catch {
        return null;
    }
}

function arraysShallowEqual<T>(a: T[], b: T[]): boolean {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let index = 0; index < a.length; index += 1) {
        if (a[index] !== b[index]) {
            return false;
        }
    }
    return true;
}

function buildAuthHeaders(
    base?: Record<string, string>
): Record<string, string> {
    const headers: Record<string, string> = base ? { ...base } : {};
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    return headers;
}

function loadProfileForEmail(email: string | null): UserProfile | null {
    try {
        const key = email ? `profile:${email}` : "profile:guest";
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.name === "string" &&
            typeof parsed.email === "string" &&
            true
        ) {
            return parsed as UserProfile;
        }
        return null;
    } catch {
        return null;
    }
}

function saveProfileForEmail(email: string | null, profile: UserProfile) {
    try {
        const key = email ? `profile:${email}` : "profile:guest";
        localStorage.setItem(key, JSON.stringify(profile));
    } catch {}
}

function App() {
    // Simple auth guard: if no token, redirect to /auth and pause rendering
    const isBrowser = typeof window !== "undefined";
    const isAuthPage = isBrowser && window.location.pathname === "/auth";
    const initialToken = isBrowser ? localStorage.getItem("auth_token") : null;
    const initialEmail = decodeJwtEmail(initialToken);
    const [hasToken] = useState<boolean>(() => isBrowser && !!initialToken);

    useEffect(() => {
        if (!isAuthPage && !hasToken && isBrowser) {
            window.location.href = "/auth";
        }
    }, [isAuthPage, hasToken, isBrowser]);

    // Render auth page as-is when at /auth
    if (isAuthPage) {
        return <AuthPage />;
    }

    // While redirecting unauthenticated users, render nothing
    if (!hasToken) {
        return null;
    }
    const [folderOwnerEmail] = useState<string | null>(() => initialEmail);
    const [plans, setPlans] = useState<TravelPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [advisorInfo, setAdvisorInfo] = useState<TripAdvisorInfo | null>(
        null
    );
    const [advisorError, setAdvisorError] = useState<string | null>(null);
    const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
    const [selectedStopRef, setSelectedStopRef] = useState<{
        planId: string;
        index: number;
    } | null>(null);
    const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
    const [mapMode, setMapMode] = useState<MapMode>(() => {
        if (typeof window === "undefined") {
            return "single";
        }
        const stored = window.localStorage.getItem("planner_map_mode");
        return stored === "multileg" ? "multileg" : "single";
    });
    const [mapRefreshKey, setMapRefreshKey] = useState(0);
    const [view, setView] = useState<"planner" | "manager" | "admin">(() => {
        if (typeof window === "undefined") {
            return "planner";
        }
        const stored = window.localStorage.getItem("app_view");
        if (
            stored === "planner" ||
            stored === "manager" ||
            stored === "admin"
        ) {
            return stored;
        }
        return "planner";
    });
    const [folders, setFolders] = useState<Folder[]>(() => [
        { id: "all", name: "All Plans", planIds: [] },
        ...loadStoredFolders(initialEmail),
    ]);
    const [libraryFolderId, setLibraryFolderId] = useState("all");
    const [profile, setProfile] = useState<UserProfile>(() => {
        const stored =
            isBrowser && typeof initialEmail !== "undefined"
                ? loadProfileForEmail(initialEmail)
                : null;
        if (stored) return stored;
        // default if nothing stored
        return {
            name: initialEmail
                ? initialEmail.split("@")[0]
                : "Jamie Hoang",
            email: initialEmail ?? "jamie.hoang@example.com",
        };
    });
    const planPersistTimers = useRef<Map<string, number>>(new Map());
    const plansRef = useRef<TravelPlan[]>([]);
    const draftPlanRef = useRef<TravelPlan | null>(null);

    // Persist profile per-user whenever it changes
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const emailFromToken = decodeJwtEmail(token);
        saveProfileForEmail(emailFromToken, profile);
    }, [profile]);

    useEffect(() => {
        if (!folders.some((folder) => folder.id === libraryFolderId)) {
            setLibraryFolderId("all");
        }
    }, [folders, libraryFolderId]);

    useEffect(() => {
        saveStoredFolders(folderOwnerEmail, folders);
    }, [folders, folderOwnerEmail]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem("app_view", view);
    }, [view]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem("planner_map_mode", mapMode);
    }, [mapMode]);

    const [draftPlan, setDraftPlan] = useState<TravelPlan | null>(null);
    const [isDraftDirty, setIsDraftDirty] = useState(false);
    const latestAdvisorRequest = useRef(0);

    useEffect(() => {
        return () => {
            if (typeof window === "undefined") {
                return;
            }
            planPersistTimers.current.forEach((timeoutId) =>
                window.clearTimeout(timeoutId)
            );
            planPersistTimers.current.clear();
        };
    }, []);

    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
        [plans, selectedPlanId]
    );
    const workingPlan = draftPlan ?? selectedPlan;
    const workingPlanStops = useMemo(
        () => workingPlan?.stops ?? [],
        [workingPlan]
    );
    const stopCount = workingPlanStops.length;

    plansRef.current = plans;
    draftPlanRef.current = draftPlan;

    const selectedStop = useMemo(() => {
        if (!workingPlan || !selectedStopRef) {
            return null;
        }
        if (selectedStopRef.planId !== workingPlan.id) {
            return null;
        }
        return workingPlanStops[selectedStopRef.index] ?? null;
    }, [workingPlan, workingPlanStops, selectedStopRef]);

    const selectedStopIndex = useMemo(() => {
        if (!workingPlan || !selectedStopRef) {
            return null;
        }
        return selectedStopRef.planId === workingPlan.id
            ? selectedStopRef.index
            : null;
    }, [workingPlan, selectedStopRef]);

    useEffect(() => {
        if (mapMode === "multileg" && stopCount < 2) {
            setMapMode("single");
        }
    }, [mapMode, stopCount]);

    function cancelScheduledPlanPersist(planId: string) {
        const timers = planPersistTimers.current;
        const timeoutId = timers.get(planId);
        if (timeoutId && typeof window !== "undefined") {
            window.clearTimeout(timeoutId);
        }
        timers.delete(planId);
    }

    function schedulePlanPersist(planId: string) {
        if (typeof window === "undefined") {
            return;
        }
        cancelScheduledPlanPersist(planId);
        const timeoutId = window.setTimeout(() => {
            void persistPlan(planId);
        }, 700);
        planPersistTimers.current.set(planId, timeoutId);
    }

    async function persistPlan(planId: string) {
        const plan = plansRef.current.find((item) => item.id === planId);
        if (!plan) {
            cancelScheduledPlanPersist(planId);
            return;
        }

        cancelScheduledPlanPersist(planId);

        try {
            const response = await fetch(`${API_BASE_URL}/plan/${planId}`, {
                method: "PUT",
                headers: buildAuthHeaders({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify(serializePlanForSave(plan)),
            });

            if (!response.ok) {
                throw new Error("Failed to save plan");
            }

            const payload: TravelPlanResponse = await response.json();
            const savedPlan = normalizePlan(payload);
            const draftMatches = draftPlanRef.current?.id === savedPlan.id;

            setPlans((prev) => {
                const index = prev.findIndex(
                    (item) => item.id === savedPlan.id
                );
                if (index === -1) {
                    return [savedPlan, ...prev];
                }
                const next = [...prev];
                next[index] = savedPlan;
                return next;
            });

            if (draftMatches) {
                setDraftPlan((prev) =>
                    prev && prev.id === savedPlan.id
                        ? {
                              ...prev,
                              title: savedPlan.title,
                              summary: savedPlan.summary,
                              createdAt: savedPlan.createdAt,
                          }
                        : prev
                );
            }

            setError(null);
        } catch (err) {
            console.error("Failed to persist plan", err);
            setError(
                "Unable to save plan changes. Please check your connection and try again."
            );
        }
    }

    useEffect(() => {
        if (!selectedPlan) {
            if (draftPlan !== null) {
                setDraftPlan(null);
            }
            setIsDraftDirty(false);
            return;
        }

        if (draftPlan && draftPlan.id === selectedPlan.id) {
            const metadataChanged =
                draftPlan.title !== selectedPlan.title ||
                draftPlan.summary !== selectedPlan.summary ||
                draftPlan.createdAt !== selectedPlan.createdAt;

            if (isDraftDirty) {
                if (metadataChanged) {
                    setDraftPlan({
                        ...draftPlan,
                        title: selectedPlan.title,
                        summary: selectedPlan.summary,
                        createdAt: selectedPlan.createdAt,
                    });
                }
                return;
            }

            if (
                metadataChanged ||
                draftPlan.stops.length !== selectedPlan.stops.length
            ) {
                setDraftPlan(clonePlan(selectedPlan));
            }
            return;
        }

        setDraftPlan(clonePlan(selectedPlan));
        setIsDraftDirty(false);
    }, [selectedPlan, draftPlan, isDraftDirty]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (view !== "planner") {
            setShowModal(false);
        }
    }, [view]);

    useEffect(() => {
        async function loadPlans() {
            try {
                const response = await fetch(`${API_BASE_URL}/plans`, {
                    headers: buildAuthHeaders(),
                });
                if (!response.ok) {
                    throw new Error("Unable to load travel plans");
                }
                const payload: PlansResponse = await response.json();
                const normalized = payload.options.map(normalizePlan);
                setPlans(normalized);
                setSelectedPlanId((prev) =>
                    prev ? prev : normalized[0]?.id ?? ""
                );
                setSelectedStopRef(null);
                setAdvisorInfo(null);
                setAdvisorError(null);
                setRouteSegments([]);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unexpected error loading plans."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadPlans();
    }, []);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        setFolders((prev) => {
            const planIds = plans.map((plan) => plan.id);
            const validIds = new Set(planIds);
            const hasAll = prev.some((folder) => folder.id === "all");
            let changed = false;

            const updated: Folder[] = prev.map((folder) => {
                if (folder.id === "all") {
                    if (arraysShallowEqual(folder.planIds, planIds)) {
                        return folder;
                    }
                    changed = true;
                    return { ...folder, planIds };
                }
                const filtered = folder.planIds.filter((id) => validIds.has(id));
                if (arraysShallowEqual(filtered, folder.planIds)) {
                    return folder;
                }
                changed = true;
                return { ...folder, planIds: filtered };
            });

            if (!hasAll) {
                changed = true;
                updated.push({ id: "all", name: "All Plans", planIds });
            }

            updated.sort((a, b) => {
                if (a.id === "all") return -1;
                if (b.id === "all") return 1;
                return a.name.localeCompare(b.name);
            });

            if (!changed && updated.length === prev.length) {
                let identical = true;
                for (let i = 0; i < updated.length; i += 1) {
                    if (updated[i] !== prev[i]) {
                        identical = false;
                        break;
                    }
                }
                if (identical) {
                    return prev;
                }
            }

            return updated;
        });
    }, [plans, isLoading]);

    useEffect(() => {
        if (
            view !== "planner" ||
            !selectedPlan ||
            selectedPlan.stops.length < 2
        ) {
            setRouteSegments([]);
            return;
        }

        let cancelled = false;
        const currentPlanId = selectedPlan.id;

        async function loadSegments() {
            try {
                if (mapMode === "multileg") {
                    const response = await fetch(
                        `${API_BASE_URL}/plan/${currentPlanId}/route-multileg`,
                        {
                            headers: buildAuthHeaders(),
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Failed to load multi-leg route");
                    }
                    const payload: MultiLegRouteResponse =
                        await response.json();
                    const segments = (payload.legs ?? [])
                        .flatMap((leg) =>
                            (leg.segments ?? []).map((seg) => ({
                                ...seg,
                                from_index:
                                    (typeof seg.from_index === "number"
                                        ? seg.from_index
                                        : 0) + leg.from_index,
                                to_index:
                                    (typeof seg.to_index === "number"
                                        ? seg.to_index
                                        : 0) + leg.from_index,
                            }))
                        )
                        .map(normalizeRouteSegment);
                    if (!cancelled) {
                        setRouteSegments(segments);
                    }
                } else {
                    const response = await fetch(
                        `${API_BASE_URL}/plan/${currentPlanId}/route`,
                        {
                            headers: buildAuthHeaders(),
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Failed to load route details");
                    }
                    const payload: MapRouteResponse = await response.json();
                    const segments = (payload.segments ?? []).map(
                        normalizeRouteSegment
                    );
                    if (!cancelled) {
                        setRouteSegments(segments);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setRouteSegments([]);
                }
            }
        }

        loadSegments();

        return () => {
            cancelled = true;
        };
    }, [selectedPlan, selectedPlanId, view, mapMode, mapRefreshKey]);

    const [planName, setPlanName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [startPlace, setStartPlace] = useState("");
    const [endPlace, setEndPlace] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [motivation, setMotivation] = useState<string[]>([]);
    const [modalTouched, setModalTouched] = useState(false);
    const [startSuggestions, setStartSuggestions] = useState<
        LocationSearchResult[]
    >([]);
    const [endSuggestions, setEndSuggestions] = useState<
        LocationSearchResult[]
    >([]);
    const [startSelection, setStartSelection] =
        useState<LocationSearchResult | null>(null);
    const [endSelection, setEndSelection] =
        useState<LocationSearchResult | null>(null);
    const startSearchIdRef = useRef(0);
    const endSearchIdRef = useRef(0);
    const startSearchTimeoutRef = useRef<number>();
    const endSearchTimeoutRef = useRef<number>();
    const startHideTimeoutRef = useRef<number>();
    const endHideTimeoutRef = useRef<number>();

    const TRIP_MOTIVATIONS = [
        "Food",
        "Museums",
        "Music",
        "Architecture",
        "Nature",
        "Shopping",
        "Nightlife",
        "Scenery",
        "Relaxation",
    ];

    const isModalValid =
        startDate.trim() && endDate.trim() && motivation.length > 0;

    useEffect(() => {
        return () => {
            if (startSearchTimeoutRef.current) {
                window.clearTimeout(startSearchTimeoutRef.current);
            }
            if (endSearchTimeoutRef.current) {
                window.clearTimeout(endSearchTimeoutRef.current);
            }
            if (startHideTimeoutRef.current) {
                window.clearTimeout(startHideTimeoutRef.current);
            }
            if (endHideTimeoutRef.current) {
                window.clearTimeout(endHideTimeoutRef.current);
            }
        };
    }, []);

    const resetModal = () => {
        setPlanName("");
        setEditingName(false);
        setStartPlace("");
        setEndPlace("");
        setStartDate("");
        setEndDate("");
        setMotivation([]);
        setModalTouched(false);
        setStartSuggestions([]);
        setEndSuggestions([]);
        setStartSelection(null);
        setEndSelection(null);
        if (startSearchTimeoutRef.current) {
            window.clearTimeout(startSearchTimeoutRef.current);
            startSearchTimeoutRef.current = undefined;
        }
        if (endSearchTimeoutRef.current) {
            window.clearTimeout(endSearchTimeoutRef.current);
            endSearchTimeoutRef.current = undefined;
        }
        if (startHideTimeoutRef.current) {
            window.clearTimeout(startHideTimeoutRef.current);
            startHideTimeoutRef.current = undefined;
        }
        if (endHideTimeoutRef.current) {
            window.clearTimeout(endHideTimeoutRef.current);
            endHideTimeoutRef.current = undefined;
        }
    };

    const createClientGeneratedId = () => {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return "local-" + crypto.randomUUID();
        }
        return "local-" + Math.random().toString(36).slice(2, 10);
    };

    const handleMapModeChange = (nextMode: MapMode) => {
        setMapMode((current) => (current === nextMode ? current : nextMode));
    };

    const handleMapRefresh = () => {
        setMapRefreshKey((value) => value + 1);
    };

    const handlePlanSummaryChange = (planId: string, summary: string) => {
        const existing = plansRef.current.find((plan) => plan.id === planId);
        if (!existing) {
            return;
        }
        const nextSummary = summary ?? "";
        if (existing.summary === nextSummary) {
            if (
                draftPlan &&
                draftPlan.id === planId &&
                draftPlan.summary !== nextSummary
            ) {
                setDraftPlan((prev) =>
                    prev ? { ...prev, summary: nextSummary } : prev
                );
            }
            return;
        }

        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === planId
                    ? { ...plan, summary: nextSummary }
                    : plan
            )
        );

        if (draftPlan && draftPlan.id === planId) {
            setDraftPlan((prev) =>
                prev ? { ...prev, summary: nextSummary } : prev
            );
        }

        schedulePlanPersist(planId);
    };

    const normaliseLocationResult = (raw: any): LocationSearchResult | null => {
        if (!raw) {
            return null;
        }
        const latitude =
            typeof raw.latitude === "number"
                ? raw.latitude
                : Number(raw.latitude);
        const longitude =
            typeof raw.longitude === "number"
                ? raw.longitude
                : Number(raw.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }
        const label =
            typeof raw.label === "string" && raw.label.trim().length
                ? raw.label.trim()
                : typeof raw.address === "string" && raw.address.trim().length
                ? raw.address.trim()
                : undefined;
        return {
            label: label ?? "Unnamed location",
            address: typeof raw.address === "string" ? raw.address : null,
            placeId:
                typeof raw.placeId === "string"
                    ? raw.placeId
                    : typeof raw.place_id === "string"
                    ? raw.place_id
                    : null,
            latitude,
            longitude,
        };
    };

    const fetchLocationSuggestions = async (
        value: string,
        limit: number,
        setSuggestions: (results: LocationSearchResult[]) => void,
        requestIdRef: MutableRefObject<number>
    ) => {
        const query = value.trim();
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        const requestId = ++requestIdRef.current;
        try {
            const response = await fetch(`${API_BASE_URL}/maps/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, limit }),
            });
            if (!response.ok) {
                throw new Error("Lookup failed");
            }
            const payload = await response.json();
            if (requestId !== requestIdRef.current) {
                return;
            }
            const results = Array.isArray(payload)
                ? payload
                      .map(normaliseLocationResult)
                      .filter((item): item is LocationSearchResult =>
                          Boolean(item)
                      )
                : [];
            setSuggestions(results);
        } catch (error) {
            if (requestId === requestIdRef.current) {
                setSuggestions([]);
            }
        }
    };

    const scheduleStartSearch = (value: string) => {
        if (startSearchTimeoutRef.current) {
            window.clearTimeout(startSearchTimeoutRef.current);
        }
        startSearchTimeoutRef.current = window.setTimeout(() => {
            void fetchLocationSuggestions(
                value,
                6,
                setStartSuggestions,
                startSearchIdRef
            );
        }, 250);
    };

    const scheduleEndSearch = (value: string) => {
        if (endSearchTimeoutRef.current) {
            window.clearTimeout(endSearchTimeoutRef.current);
        }
        endSearchTimeoutRef.current = window.setTimeout(() => {
            void fetchLocationSuggestions(
                value,
                6,
                setEndSuggestions,
                endSearchIdRef
            );
        }, 250);
    };

    const cancelStartHide = () => {
        if (startHideTimeoutRef.current) {
            window.clearTimeout(startHideTimeoutRef.current);
            startHideTimeoutRef.current = undefined;
        }
    };

    const cancelEndHide = () => {
        if (endHideTimeoutRef.current) {
            window.clearTimeout(endHideTimeoutRef.current);
            endHideTimeoutRef.current = undefined;
        }
    };

    const dismissStartSuggestions = () => {
        cancelStartHide();
        startHideTimeoutRef.current = window.setTimeout(() => {
            setStartSuggestions([]);
        }, 120);
    };

    const handleModalSave = async () => {
        setModalTouched(true);
        if (!isModalValid) {
            return;
        }

        const trimmedName = planName.trim();

        const planId = createClientGeneratedId();
        const summaryParts: string[] = [];
        if (startDate && endDate) {
            summaryParts.push(`Dates: ${startDate} → ${endDate}.`);
        }
        if (motivation.length) {
            summaryParts.push(`Focus: ${motivation.join(", ")}.`);
        }

        const newPlan: TravelPlan = {
            id: planId,
            title: trimmedName || "Untitled Plan",
            summary: summaryParts.join(" ") || "Blank plan",
            stops: [],
            createdAt: new Date().toISOString(),
        };

        // Apply the blank plan immediately (no assistant generation)
        setPlans((prev) => [newPlan, ...prev]);
        setSelectedPlanId(newPlan.id);
        setSelectedStopRef(null);
        setAdvisorInfo(null);
        setAdvisorError(null);
        setError(null);

        // Prepare draft for editing
        setDraftPlan(clonePlan(newPlan));
        setIsDraftDirty(false);

        setShowModal(false);
        resetModal();
    };
    const handleDraftAddStop = () => {
        setDraftPlan((prev) => {
            if (!prev) return prev;
            setIsDraftDirty(true);
            const nextIndex = prev.stops.length + 1;
            const newStop: PlanStop = {
                label: `New Stop ${nextIndex}`,
                description: "",
            };
            return { ...prev, stops: [...prev.stops, newStop] };
        });
        setRouteSegments([]);
    };

    const handleAddSuggestionStop = (suggestion: TripAdvisorSuggestion) => {
        const planId = draftPlan?.id ?? null;
        if (!planId) return;
        const insertionIndex =
            selectedStopRef && selectedStopRef.planId === planId
                ? selectedStopRef.index + 1
                : undefined;
        // reuse insert logic if available; otherwise append
        setDraftPlan((prev) => {
            if (!prev) return prev;
            setIsDraftDirty(true);
            const stop: PlanStop = {
                label: suggestion.name,
                description: suggestion.address ?? "",
                placeId: suggestion.placeId,
                latitude: suggestion.latitude,
                longitude: suggestion.longitude,
            };
            const idx = insertionIndex ?? prev.stops.length;
            const nextStops = [
                ...prev.stops.slice(0, idx),
                stop,
                ...prev.stops.slice(idx),
            ];
            return { ...prev, stops: nextStops };
        });
        setRouteSegments([]);
    };

    const handleAssistantAddStop = (
        stop: PlanStop,
        options?: InsertStopOptions
    ) => {
        const selectIndex = options?.index;
        setDraftPlan((prev) => {
            if (!prev) return prev;
            setIsDraftDirty(true);
            const idx =
                typeof selectIndex === "number"
                    ? Math.max(0, Math.min(selectIndex, prev.stops.length))
                    : prev.stops.length;
            const nextStops = [
                ...prev.stops.slice(0, idx),
                stop,
                ...prev.stops.slice(idx),
            ];
            return { ...prev, stops: nextStops };
        });
        setRouteSegments([]);
        if (options?.select) {
            const planId = draftPlan?.id ?? "";
            const index = options?.index ?? draftPlan?.stops.length ?? 0;
            setSelectedStopRef({ planId, index });
        }
    };
    const handleDraftUpdateStop = (
        stopIndex: number,
        updates: Partial<PlanStop>
    ) => {
        setDraftPlan((prev) => {
            if (!prev) {
                return prev;
            }
            setIsDraftDirty(true);
            const stops = prev.stops.map((stop, index) =>
                index === stopIndex ? { ...stop, ...updates } : stop
            );
            return { ...prev, stops };
        });
        setRouteSegments([]);
    };

    const handleDraftMoveStop = (fromIndex: number, toIndex: number) => {
        let planIdForUpdate: string | null = null;
        let normalizedFrom = fromIndex;
        let normalizedTo = toIndex;

        setDraftPlan((prev) => {
            if (!prev) {
                return prev;
            }
            const maxIndex = prev.stops.length - 1;
            if (maxIndex < 0) {
                return prev;
            }
            normalizedFrom = Math.max(0, Math.min(normalizedFrom, maxIndex));
            normalizedTo = Math.max(0, Math.min(normalizedTo, maxIndex));
            if (normalizedFrom === normalizedTo) {
                return prev;
            }
            planIdForUpdate = prev.id;
            const stops = [...prev.stops];
            const [moved] = stops.splice(normalizedFrom, 1);
            stops.splice(normalizedTo, 0, moved);
            setIsDraftDirty(true);
            return { ...prev, stops };
        });

        if (planIdForUpdate !== null) {
            const planId = planIdForUpdate;
            const sourceIndex = normalizedFrom;
            const targetIndex = normalizedTo;

            setSelectedStopRef((current) => {
                if (!current || current.planId !== planId) {
                    return current;
                }
                if (current.index === sourceIndex) {
                    return { planId, index: targetIndex };
                }
                if (sourceIndex < targetIndex) {
                    if (
                        current.index > sourceIndex &&
                        current.index <= targetIndex
                    ) {
                        return { planId, index: current.index - 1 };
                    }
                } else if (sourceIndex > targetIndex) {
                    if (
                        current.index >= targetIndex &&
                        current.index < sourceIndex
                    ) {
                        return { planId, index: current.index + 1 };
                    }
                }
                return current;
            });
            setRouteSegments([]);
        }
    };

    const handleDraftRemoveStop = (stopIndex: number) => {
        if (!draftPlan) {
            return;
        }
        const planId = draftPlan.id;
        setDraftPlan((prev) => {
            if (!prev) {
                return prev;
            }
            setIsDraftDirty(true);
            const stops = prev.stops.filter((_, index) => index !== stopIndex);
            return { ...prev, stops };
        });
        setSelectedStopRef((current) => {
            if (!current || current.planId !== planId) {
                return current;
            }
            if (current.index === stopIndex) {
                return null;
            }
            if (current.index > stopIndex) {
                return { planId, index: current.index - 1 };
            }
            return current;
        });
    };

    const handleDraftSave = async () => {
        if (!draftPlan) {
            return;
        }

        cancelScheduledPlanPersist(draftPlan.id);

        try {
            const response = await fetch(
                `${API_BASE_URL}/plan/${draftPlan.id}`,
                {
                    method: "PUT",
                    headers: buildAuthHeaders({
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(serializePlanForSave(draftPlan)),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save plan");
            }

            const payload: TravelPlanResponse = await response.json();
            const savedPlan = normalizePlan(payload);

            setPlans((prev) => {
                const index = prev.findIndex(
                    (plan) => plan.id === savedPlan.id
                );
                if (index === -1) {
                    return [savedPlan, ...prev];
                }
                const next = [...prev];
                next[index] = savedPlan;
                return next;
            });
            setRouteSegments([]);
            setAdvisorInfo(null);
            setAdvisorError(null);
            setDraftPlan(clonePlan(savedPlan));
            setIsDraftDirty(false);
            setError(null);
        } catch (err) {
            console.error("Failed to save plan updates", err);
            setError("Unable to save plan changes. Please try again.");
        }
    };

    const handleAddStop = (planId: string) => {
        setPlans((prev) =>
            prev.map((plan) => {
                if (plan.id !== planId) {
                    return plan;
                }
                const nextIndex = plan.stops.length + 1;
                const newStop: PlanStop = {
                    label: `New Stop ${nextIndex}`,
                    description: "",
                };
                return { ...plan, stops: [...plan.stops, newStop] };
            })
        );
    };

    const handleUpdateStop = (
        planId: string,
        stopIndex: number,
        updates: Partial<PlanStop>
    ) => {
        let updatedStop: PlanStop | null = null;
        setPlans((prev) =>
            prev.map((plan) => {
                if (plan.id !== planId) {
                    return plan;
                }
                const stops = plan.stops.map((stop, index) => {
                    if (index !== stopIndex) {
                        return stop;
                    }
                    updatedStop = { ...stop, ...updates };
                    return updatedStop;
                });
                return { ...plan, stops };
            })
        );
        if (
            planId === selectedPlanId &&
            updatedStop &&
            selectedStopRef &&
            selectedStopRef.planId === planId &&
            selectedStopRef.index === stopIndex
        ) {
            setSelectedStopRef({ planId, index: stopIndex });
        }
    };

    const handleRemoveStop = (planId: string, stopIndex: number) => {
        setPlans((prev) =>
            prev.map((plan) => {
                if (plan.id !== planId) {
                    return plan;
                }
                const stops = plan.stops.filter(
                    (_, index) => index !== stopIndex
                );
                return { ...plan, stops };
            })
        );

        if (selectedStopRef && selectedStopRef.planId === planId) {
            if (selectedStopRef.index === stopIndex) {
                setSelectedStopRef(null);
                setAdvisorInfo(null);
                setAdvisorError(null);
            } else if (selectedStopRef.index > stopIndex) {
                setSelectedStopRef({
                    planId,
                    index: selectedStopRef.index - 1,
                });
            }
        }
    };

    const handleCreateLocalPlan = () => {
        const newPlan: TravelPlan = {
            id: createClientGeneratedId(),
            title: "Untitled Plan",
            summary:
                "Describe this adventure so it stands out in your library.",
            stops: [],
            createdAt: new Date().toISOString(),
        };
        setPlans((prev) => [newPlan, ...prev]);
        setSelectedPlanId(newPlan.id);
        setSelectedStopRef(null);
        setAdvisorInfo(null);
        setAdvisorError(null);
        setDraftPlan(clonePlan(newPlan));
        setIsDraftDirty(false);
    };

    const handleCreateFolder = (name: string): string | null => {
        const trimmed = name.trim();
        if (!trimmed) {
            return null;
        }
        const id = `folder-${createClientGeneratedId()}`;
        let created = false;
        setFolders((prev) => {
            if (
                prev.some(
                    (folder) =>
                        folder.name.toLowerCase() === trimmed.toLowerCase()
                )
            ) {
                return prev;
            }
            created = true;
            return [...prev, { id, name: trimmed, planIds: [] }];
        });
        if (created) {
            setLibraryFolderId(id);
            return id;
        }
        return null;
    };

    const handleAssignPlanToFolder = (folderId: string, planId: string) => {
        if (folderId === "all") {
            return;
        }
        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === folderId
                    ? {
                          ...folder,
                          planIds: folder.planIds.includes(planId)
                              ? folder.planIds
                              : [...folder.planIds, planId],
                      }
                    : folder
            )
        );
    };

    const handleRemovePlanFromFolder = (folderId: string, planId: string) => {
        if (folderId === "all") {
            return;
        }
        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === folderId
                    ? {
                          ...folder,
                          planIds: folder.planIds.filter((id) => id !== planId),
                      }
                    : folder
            )
        );
    };

    const handleUpdateProfile = (updates: Partial<UserProfile>) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    };

    const handleUpdatePlanTitle = (planId: string, title: string) => {
        const existing = plansRef.current.find((plan) => plan.id === planId);
        if (!existing) {
            return;
        }
        const nextTitle = title ?? "";
        if (existing.title === nextTitle) {
            if (draftPlan && draftPlan.id === planId && draftPlan.title !== nextTitle) {
                setDraftPlan((prev) => (prev ? { ...prev, title: nextTitle } : prev));
            }
            return;
        }

        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === planId ? { ...plan, title: nextTitle } : plan
            )
        );

        if (draftPlan && draftPlan.id === planId) {
            setDraftPlan((prev) =>
                prev ? { ...prev, title: nextTitle } : prev
            );
        }

        schedulePlanPersist(planId);
    };

    const handleUpdatePlanDate = (planId: string, isoDate: string) => {
        if (!isoDate) {
            return;
        }
        const existing = plansRef.current.find((plan) => plan.id === planId);
        if (!existing) {
            return;
        }
        const parsed = new Date(isoDate);
        if (Number.isNaN(parsed.getTime())) {
            return;
        }
        const createdAt = parsed.toISOString();
        if (existing.createdAt === createdAt) {
            if (
                draftPlan &&
                draftPlan.id === planId &&
                draftPlan.createdAt !== createdAt
            ) {
                setDraftPlan((prev) =>
                    prev ? { ...prev, createdAt } : prev
                );
            }
            return;
        }

        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === planId ? { ...plan, createdAt } : plan
            )
        );

        if (draftPlan && draftPlan.id === planId) {
            setDraftPlan((prev) =>
                prev ? { ...prev, createdAt } : prev
            );
        }

        schedulePlanPersist(planId);
    };

    const handleDeletePlan = async (planId: string) => {
        const existing = plansRef.current.find((plan) => plan.id === planId);
        if (!existing) {
            return;
        }

        cancelScheduledPlanPersist(planId);

        try {
            const response = await fetch(`${API_BASE_URL}/plan/${planId}`, {
                method: "DELETE",
                headers: buildAuthHeaders(),
            });

            if (!response.ok && response.status !== 404) {
                throw new Error("Failed to delete plan");
            }
        } catch (err) {
            console.error("Failed to delete plan", err);
            setError("Unable to delete plan. Please try again.");
            return;
        }

        setPlans((prev) => {
            const updated = prev.filter((plan) => plan.id !== planId);
            if (prev.length === updated.length) {
                return prev;
            }
            if (selectedPlanId === planId) {
                const fallback = updated[0]?.id ?? "";
                setSelectedPlanId(fallback);
                setSelectedStopRef(null);
                setAdvisorInfo(null);
                setAdvisorError(null);
                setRouteSegments([]);
            }
            return updated;
        });

        setFolders((prev) =>
            prev.map((folder) =>
                folder.id === "all"
                    ? folder
                    : {
                          ...folder,
                          planIds: folder.planIds.filter((id) => id !== planId),
                      }
            )
        );

        if (draftPlanRef.current?.id === planId) {
            setDraftPlan(null);
            setIsDraftDirty(false);
        }

        setError(null);
    };

    const handleStopSelected = (stop: PlanStop, stopIndex: number) => {
        if (!workingPlan) {
            return;
        }

        startTransition(() => {
            setSelectedStopRef({ planId: workingPlan.id, index: stopIndex });
        });

        const requestId = ++latestAdvisorRequest.current;
        setAdvisorLoading(true);
        setAdvisorError(null);

        const payload = {
            name: stop.label,
            description: stop.description,
            latitude: stop.latitude,
            longitude: stop.longitude,
            place_id: stop.placeId,
        };

        void (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tripadvisor`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error("Unable to fetch place details.");
                }
                const payloadData: TripAdvisorResponsePayload =
                    await response.json();
                if (latestAdvisorRequest.current === requestId) {
                    setAdvisorInfo(normalizeTripAdvisorInfo(payloadData.info));
                    setAdvisorError(null);
                }
            } catch (err) {
                if (latestAdvisorRequest.current === requestId) {
                    setAdvisorError(
                        err instanceof Error
                            ? err.message
                            : "Unexpected error loading place details."
                    );
                    setAdvisorInfo(null);
                }
            } finally {
                if (latestAdvisorRequest.current === requestId) {
                    setAdvisorLoading(false);
                }
            }
        })();
    };

    useEffect(() => {
        latestAdvisorRequest.current += 1;
        setAdvisorInfo(null);
        setAdvisorError(null);
        setAdvisorLoading(false);
        setSelectedStopRef(null);
        setRouteSegments([]);
    }, [selectedPlanId]);

    return (
        <div className="app">
            <header className="app__header">
                <button
                    type="button"
                    className="app__logo"
                    onClick={() => setView("planner")}
                >
                    Pathfinder
                </button>
                <div className="app__header-actions">
                    {view !== "planner" ? (
                        <button
                            type="button"
                            className="app__nav-button"
                            onClick={() => setView("planner")}
                        >
                            Back to Planner
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="app__nav-button"
                            onClick={() => setView("manager")}
                        >
                            Manage Plans
                        </button>
                    )}
                    {view === "planner" ? (
                        <button
                            type="button"
                            className="info__create"
                            onClick={() => setShowModal(true)}
                            disabled={isLoading}
                        >
                            Create New Plan
                        </button>
                    ) : null}
                    <button
                        type="button"
                        className={
                            view === "admin"
                                ? "app__profile-button app__profile-button--active"
                                : "app__profile-button"
                        }
                        onClick={() => setView("admin")}
                        aria-label="Open profile settings"
                    >
                        <span className="app__profile-icon" aria-hidden>
                            <svg viewBox="0 0 24 24" focusable="false">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 19c0-3.3137 3.134-6 7-6h2c3.866 0 7 2.6863 7 6v1H4v-1z" />
                            </svg>
                        </span>
                    </button>
                </div>
            </header>

            {view === "planner" && showModal && (
                <div className="modal-overlay">
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-plan-title"
                    >
                        <div className="modal__title">
                            {editingName ? (
                                <input
                                    type="text"
                                    value={planName}
                                    onChange={(e) =>
                                        setPlanName(e.target.value)
                                    }
                                    onBlur={() => setEditingName(false)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            setEditingName(false);
                                    }}
                                    autoFocus
                                    className="modal__title-input"
                                    placeholder="Enter plan name..."
                                />
                            ) : (
                                <span
                                    id="create-plan-title"
                                    className="modal__title-text"
                                    onClick={() => setEditingName(true)}
                                >
                                    {planName || "Untitled Plan"}
                                </span>
                            )}
                        </div>

                        <div className="modal__fields">
                            <div className="modal__row">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>
                            <div className="modal__row">
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal__motivation">
                            <p>Trip Motivation:</p>
                            <div className="modal__motivation-list">
                                {TRIP_MOTIVATIONS.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() =>
                                            setMotivation(
                                                motivation.includes(option)
                                                    ? motivation.filter(
                                                          (m) => m !== option
                                                      )
                                                    : [...motivation, option]
                                            )
                                        }
                                        className={`modal__motivation-btn ${
                                            motivation.includes(option)
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="modal__actions">
                            <button
                                className="btn btn--secondary"
                                onClick={() => {
                                    setShowModal(false);
                                    resetModal();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn--primary"
                                onClick={handleModalSave}
                                disabled={!isModalValid}
                            >
                                Save Plan
                            </button>
                        </div>
                        {modalTouched && !isModalValid && (
                            <div
                                style={{
                                    color: "red",
                                    marginTop: 8,
                                    fontSize: 13,
                                }}
                            >
                                Please choose start and end dates and select at
                                least one motivation.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === "planner" ? (
                <div className="app__layout">
                    <aside className="app__summary">
                        <InfoPanel
                            plan={selectedPlan}
                            plans={plans}
                            folders={folders}
                            selectedFolderId={libraryFolderId}
                            onSelectFolder={setLibraryFolderId}
                            selectedPlanId={selectedPlanId}
                            onSelectPlan={setSelectedPlanId}
                            onUpdatePlanTitle={handleUpdatePlanTitle}
                            onUpdatePlanSummary={handlePlanSummaryChange}
                            onDeletePlan={handleDeletePlan}
                            routeSegments={routeSegments}
                        />
                    </aside>

                    <section className="app__content">
                        {error ? (
                            <div className="app__error">{error}</div>
                        ) : null}
                        <div className="app__primary">
                            <div className="app__map">
                                <MapView
                                    plan={selectedPlan}
                                    mode={mapMode}
                                    onModeChange={handleMapModeChange}
                                    refreshKey={mapRefreshKey}
                                    onRequestRefresh={handleMapRefresh}
                                />
                            </div>
                            <div className="app__to-go">
                                <ToGoList
                                    plan={selectedPlan}
                                    draftStops={draftPlan?.stops ?? null}
                                    isLoading={isLoading}
                                    onSelectStop={handleStopSelected}
                                    selectedStopIndex={selectedStopIndex}
                                    onAddStop={
                                        draftPlan
                                            ? handleDraftAddStop
                                            : undefined
                                    }
                                    onUpdateStop={
                                        draftPlan
                                            ? handleDraftUpdateStop
                                            : undefined
                                    }
                                    onRemoveStop={
                                        draftPlan
                                            ? handleDraftRemoveStop
                                            : undefined
                                    }
                                    onSave={
                                        draftPlan ? handleDraftSave : undefined
                                    }
                                    hasPendingChanges={isDraftDirty}
                                />
                            </div>
                        </div>
                        <TripAdvisor
                            selectedStop={selectedStop}
                            info={advisorInfo}
                            isLoading={advisorLoading}
                            error={advisorError}
                            stops={
                                draftPlan?.stops ?? selectedPlan?.stops ?? []
                            }
                            onAddSuggestion={
                                draftPlan ? handleAddSuggestionStop : undefined
                            }
                        />
                    </section>

                    <aside className="app__assistant">
                        <AiAssistantPanel
                            planTitle={workingPlan?.title ?? null}
                            selectedStop={selectedStop}
                            selectedStopIndex={selectedStopIndex}
                            stops={draftPlan?.stops ?? workingPlanStops}
                            onAddStop={
                                draftPlan ? handleAssistantAddStop : undefined
                            }
                            onUpdateStop={
                                draftPlan ? handleDraftUpdateStop : undefined
                            }
                            onRemoveStop={
                                draftPlan ? handleDraftRemoveStop : undefined
                            }
                            onMoveStop={
                                draftPlan ? handleDraftMoveStop : undefined
                            }
                        />
                    </aside>
                </div>
            ) : view === "manager" ? (
                <PlanManager
                    plans={plans}
                    folders={folders}
                    onCreateFolder={handleCreateFolder}
                    onAssignPlan={handleAssignPlanToFolder}
                    onRemovePlan={handleRemovePlanFromFolder}
                    onUpdatePlanTitle={handleUpdatePlanTitle}
                    onUpdatePlanDate={handleUpdatePlanDate}
                    onDeletePlan={handleDeletePlan}
                />
            ) : (
                <AdminPanel
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                />
            )}
        </div>
    );
}

function serializePlanForSave(plan: TravelPlan) {
    return {
        id: plan.id,
        title: plan.title,
        summary: plan.summary,
        createdAt: plan.createdAt,
        stops: plan.stops.map(serializeStopForSave),
    };
}

function serializeStopForSave(stop: PlanStop) {
    return {
        label: stop.label,
        description: stop.description ?? "",
        place_id: stop.placeId ?? null,
        latitude: typeof stop.latitude === "number" ? stop.latitude : null,
        longitude: typeof stop.longitude === "number" ? stop.longitude : null,
    };
}

function clonePlan(plan: TravelPlan): TravelPlan {
    return {
        ...plan,
        stops: plan.stops.map((stop, index) => ({
            ...stop,
            __originalIndex:
                typeof stop.__originalIndex === "number"
                    ? stop.__originalIndex
                    : index,
        })),
    };
}

function normalizePlan(plan: TravelPlanResponse): TravelPlan {
    return {
        id: plan.id,
        title: plan.title,
        summary: plan.summary,
        createdAt: plan.createdAt,
        stops: plan.stops.map((stop, index) => ({
            label: stop.label,
            description: stop.description ?? undefined,
            placeId: stop.placeId ?? stop.place_id ?? undefined,
            latitude:
                typeof stop.latitude === "number" ? stop.latitude : undefined,
            longitude:
                typeof stop.longitude === "number" ? stop.longitude : undefined,
            timeToSpendDays:
                typeof stop.timeToSpendDays === "number"
                    ? stop.timeToSpendDays
                    : undefined,
            timeToSpendHours:
                typeof stop.timeToSpendHours === "number"
                    ? stop.timeToSpendHours
                    : undefined,
            timeToSpendMinutes:
                typeof stop.timeToSpendMinutes === "number"
                    ? stop.timeToSpendMinutes
                    : undefined,
            __originalIndex: index,
        })),
    };
}

function normalizeTripAdvisorInfo(
    info: TripAdvisorResponsePayload["info"]
): TripAdvisorInfo {
    return {
        id: info.id,
        name: info.name,
        city: info.city,
        country: info.country,
        address: info.address,
        summary: info.summary,
        nearbyRestaurants: info.nearby_restaurants.map(normalizeSuggestion),
        nearbyHotels: info.nearby_hotels.map(normalizeSuggestion),
        nearbyAttractions: info.nearby_attractions.map(normalizeSuggestion),
        latitude: info.coordinates?.latitude,
        longitude: info.coordinates?.longitude,
    };
}

function normalizeSuggestion(
    suggestion: TripAdvisorSuggestionPayload
): TripAdvisorSuggestion {
    return {
        name: suggestion.name,
        rating: suggestion.rating,
        totalRatings: suggestion.total_ratings,
        address: suggestion.address,
        priceLevel: suggestion.price_level,
        openNow: suggestion.open_now,
        types: suggestion.types ?? [],
        placeId: suggestion.place_id,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
    };
}

function normalizeRouteSegment(segment: RouteSegmentResponse): RouteSegment {
    return {
        fromIndex: segment.from_index,
        toIndex: segment.to_index,
        mode: segment.mode,
        durationText: segment.duration_text,
        distanceText: segment.distance_text,
        instructions: segment.instructions,
        agency: segment.agency,
        lineName: segment.line_name,
    };
}

export default App;
