"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, setupMotion } from "@/lib/motion";

/**
 * Scroll choreography for the landing page, driven by GSAP ScrollTrigger. Everything
 * is scrubbed to the scroll position so one section hands off to the next without a
 * break: the reading thread fills, headings ink in word by word, rows rise in, and the
 * section being left settles back. Markup opts in through data attributes inside
 * `[data-home]`; with reduced motion nothing here runs and the page stays static.
 */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home]");
    if (!root || !setupMotion()) return;

    const splits: SplitText[] = [];
    const scrub = 0.8;

    const ctx = gsap.context(() => {
      // Page progress, pinned under the navbar.
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );

      // Hero intro: headline lines slide up out of their masks, then the rest follows.
      gsap
        .timeline({ defaults: { ease: "power4.out", duration: 1.1 } })
        .fromTo("[data-hero-line]", { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.12 })
        .fromTo("[data-hero-fade]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.9 }, "-=0.7")
        .fromTo("[data-hero-stats]", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.8");

      // Hero drifts up at two speeds as the reader leaves it.
      const heroOut = { trigger: root.querySelector("[data-hero]"), start: "top top", end: "bottom top", scrub };
      gsap.to("[data-hero-copy]", { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger: heroOut });
      gsap.to("[data-hero-stats-inner]", { yPercent: -8, ease: "none", scrollTrigger: heroOut });

      // Reading thread: one line through every section, filled by scroll.
      gsap.fromTo(
        "[data-thread-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.querySelector("[data-thread]"), start: "top 60%", end: "bottom 60%", scrub },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section, i, all) => {
        const node = section.querySelector("[data-node]");
        if (node) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 60%",
            toggleClass: { targets: node, className: "is-active" },
          });
        }

        // Settle the section being left so the next one takes focus.
        if (i < all.length - 1) {
          gsap.to(section, {
            opacity: 0.35,
            y: -32,
            ease: "none",
            scrollTrigger: { trigger: section, start: "bottom 55%", end: "bottom 5%", scrub },
          });
        }
      });

      // Headings ink in word by word, tied to scroll.
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((heading) => {
        const split = SplitText.create(heading, { type: "words", wordsClass: "split-word" });
        splits.push(split);
        gsap.set(heading, { autoAlpha: 1 });
        gsap.fromTo(
          split.words,
          { opacity: 0.12, yPercent: 35 },
          {
            opacity: 1,
            yPercent: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: heading, start: "top 88%", end: "top 52%", scrub },
          },
        );
      });

      // Rows and blocks rise in sequence as their group scrolls up.
      gsap.utils.toArray<HTMLElement>("[data-rise-group]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-rise]"),
          { y: 48, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.15,
            ease: "none",
            scrollTrigger: { trigger: group, start: "top 92%", end: "top 50%", scrub },
          },
        );
      });

      // Code unrolls top to bottom.
      gsap.utils.toArray<HTMLElement>("[data-unroll]").forEach((block) => {
        gsap.fromTo(
          block,
          { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: block, start: "top 85%", end: "top 35%", scrub },
          },
        );
      });
    }, root);

    // Web fonts change line heights; re-measure once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}
