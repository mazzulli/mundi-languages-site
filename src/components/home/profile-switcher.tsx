"use client";

import { useId, useState, type KeyboardEvent } from "react";

import { CtaLink } from "@/components/ui/cta-link";
import { cx } from "@/lib/utils";
import { profiles, type ProfileId } from "@content/profiles";

/**
 * "Sou aluno · Sou empresa · Sou professor" — switches the promise and both CTAs of the hero
 * (spec §5.2/§5.3). Accessible tabs pattern with arrow-key navigation.
 */
export function ProfileSwitcher() {
  const [active, setActive] = useState<ProfileId>("student");
  const baseId = useId();
  const profile = profiles.find((p) => p.id === active)!;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!offset) return;
    event.preventDefault();
    const next = profiles[(index + offset + profiles.length) % profiles.length]!;
    setActive(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Escolha o seu perfil"
        className="bg-ink-900/70 ring-paper/12 relative inline-flex rounded-full p-1 ring-1"
      >
        {profiles.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cx(
                "relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 sm:px-5",
                selected ? "text-ink-950" : "text-primary-200 hover:text-paper",
              )}
            >
              {selected && (
                <span
                  aria-hidden
                  className="bg-paper absolute inset-0 -z-10 rounded-full shadow-[0_6px_20px_-8px_rgb(0_0_0/0.6)]"
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-6"
      >
        {/* `key` remounts the panel → CSS entrance animation on every switch. */}
        <div
          key={active}
          className="motion-safe:animate-[intro-fade_0.6s_var(--ease-expo-out)_both]"
        >
          <p className="font-display text-paper text-xl sm:text-2xl">{profile.promise}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink
              href={profile.primary.href}
              whatsappMessage={profile.primary.whatsappMessage}
              size="lg"
            >
              {profile.primary.label}
            </CtaLink>
            <CtaLink
              href={profile.secondary.href}
              whatsappMessage={profile.secondary.whatsappMessage}
              variant="secondary-on-ink"
              size="lg"
            >
              {profile.secondary.label}
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}
