import type { ComponentProfile } from "../types/diagnostic";

const SIZE = 420;
const CENTER = SIZE / 2;
const RADIUS = 150;

function point(index: number, level: number, count: number): [number, number] {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
  const distance = (RADIUS * level) / 5;
  return [CENTER + Math.cos(angle) * distance, CENTER + Math.sin(angle) * distance];
}

function polygonPoints(level: number, count: number): string {
  return Array.from({ length: count }, (_, index) => point(index, level, count).join(",")).join(" ");
}

export function ProfileVisual({ profiles }: { profiles: ComponentProfile[] }) {
  const dataPoints = profiles
    .map((profile, index) => point(index, profile.level.visualLevel, profiles.length).join(","))
    .join(" ");

  return (
    <div className="profile-visual">
      <figure className="radar-card">
        <svg
          className="radar-chart"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-labelledby="profile-chart-title profile-chart-description"
        >
          <title id="profile-chart-title">Five-part AI fluency profile</title>
          <desc id="profile-chart-description">
            {profiles
              .map((profile) => `${profile.component.name}: ${profile.level.name}`)
              .join(". ")}
          </desc>
          {[1, 2, 3, 4, 5].map((level) => (
            <polygon key={level} className="radar-chart__grid" points={polygonPoints(level, profiles.length)} />
          ))}
          {profiles.map((profile, index) => {
            const [x, y] = point(index, 5, profiles.length);
            return (
              <line
                key={profile.component.id}
                className="radar-chart__axis"
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
              />
            );
          })}
          <polygon className="radar-chart__area" points={dataPoints} />
          {profiles.map((profile, index) => {
            const [x, y] = point(index, profile.level.visualLevel, profiles.length);
            return <circle key={profile.component.id} className="radar-chart__point" cx={x} cy={y} r="5" />;
          })}
        </svg>
        <figcaption>Five distinct habits, shown together as one profile.</figcaption>
      </figure>

      <div className="profile-list">
        {profiles.map((profile, index) => (
          <article className="profile-row" key={profile.component.id}>
            <div className="profile-row__heading">
              <span className="profile-row__number">0{index + 1}</span>
              <div>
                <h3>{profile.component.name}</h3>
                <p className="profile-row__level">{profile.level.name}</p>
              </div>
            </div>
            <div
              className="level-segments"
              role="img"
              aria-label={`${profile.level.visualLevel} of 5 — ${profile.level.name}`}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={level <= profile.level.visualLevel ? "level-segments__active" : ""}
                />
              ))}
            </div>
            <p>{profile.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
