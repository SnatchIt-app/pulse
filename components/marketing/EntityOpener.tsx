import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";

// AEO-friendly entity opener — self-contained factual paragraph at the top of a
// service page. Final copy can drop into `body` later; structure stays.
export default function EntityOpener({ body }: { body: string }) {
  return (
    <Section className="bg-paper py-16 md:py-24">
      <Container>
        <MotionFade>
          <p className="text-ink/80 max-w-3xl font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
            {body}
          </p>
        </MotionFade>
      </Container>
    </Section>
  );
}
