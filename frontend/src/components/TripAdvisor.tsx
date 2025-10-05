import type { PlanStop, TripAdvisorInfo } from "../App";
import "./TripAdvisor.css";

type TripAdvisorProps = {
    selectedStop: PlanStop | null;
    info: TripAdvisorInfo | null;
    stops: PlanStop[];
    isLoading: boolean;
    error: string | null;
};

function TripAdvisor({
    selectedStop,
    info,
    stops,
    isLoading,
    error,
}: TripAdvisorProps) {
    const sections: {
        title: string;
        items: string[];
        intent: "eat" | "see" | "stay";
    }[] = info
        ? [
              {
                  title: "Nearby Restaurants",
                  items: info.nearbyRestaurants,
                  intent: "eat",
              },
              {
                  title: "Nearby Attractions",
                  items: info.nearbyAttractions,
                  intent: "see",
              },
              {
                  title: "Stay Options",
                  items: info.nearbyHotels,
                  intent: "stay",
              },
          ]
        : [];

    return (
        <section className="advisor">
            <header className="advisor__header">
                <div>
                    <p className="advisor__eyebrow">Trip Advisor</p>
                    <h3>
                        {selectedStop
                            ? selectedStop.label
                            : "Select a stop to see details"}
                    </h3>
                </div>
            </header>

            {error ? <div className="advisor__error">{error}</div> : null}

            {isLoading ? (
                <div className="advisor__loading">
                    Gathering local insights…
                </div>
            ) : info ? (
                <div className="advisor__content">
                    <p className="advisor__summary">{info.summary}</p>

                    <div className="advisor__grid">
                        {sections.map((section) => (
                            <div
                                className="advisor__section"
                                key={section.title}
                            >
                                <h4>{section.title}</h4>
                                <ul>
                                    {section.items.length ? (
                                        section.items.map((item) => (
                                            <LineItem
                                                key={item}
                                                label={item}
                                                intent={section.intent}
                                            />
                                        ))
                                    ) : (
                                        <li className="advisor__empty-item">
                                            Nothing nearby detected yet.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="advisor__placeholder">
                    <p>
                        Select one of the stops in your itinerary to see
                        tailored suggestions.
                    </p>
                    {stops.length ? (
                        <ol>
                            {stops.map((stop, index) => (
                                <li key={stop.label + index}>{stop.label}</li>
                            ))}
                        </ol>
                    ) : null}
                </div>
            )}
        </section>
    );
}

export default TripAdvisor;

type LineItemProps = {
    label: string;
    intent: "eat" | "see" | "stay";
};

function LineItem({ label, intent }: LineItemProps) {
    const hints: Record<LineItemProps["intent"], string> = {
        eat: "Tap to add this restaurant to your plan.",
        see: "Great detour if you have a spare hour.",
        stay: "Consider booking early—demand is high in peak season.",
    };

    return (
        <li
            className="advisor__item"
            tabIndex={0}
            aria-label={`${label}. ${hints[intent]}`}
        >
            <span className="advisor__item-name">{label}</span>
            <div className="advisor__tooltip" role="note">
                <strong>{label}</strong>
                <span>{hints[intent]}</span>
            </div>
        </li>
    );
}
