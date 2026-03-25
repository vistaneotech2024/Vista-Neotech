import type { CSSProperties } from 'react';
import styles from './DotsLoader.module.css';

export type DotsLoaderProps = {
  /** Visual size of dots */
  size?: 'sm' | 'md' | 'lg';
  /** Extra class on wrapper (e.g. margin) */
  className?: string;
  /** Dot color (CSS value). Defaults to accent token. */
  color?: string;
  /** Visually hidden label for screen readers */
  label?: string;
};

/**
 * Five-dot vertical pulse loader — same structure as `.wrapper` + span × 5.
 */
export function DotsLoader({
  size = 'md',
  className = '',
  color,
  label = 'Loading',
}: DotsLoaderProps) {
  const sizeClass = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : '';
  const styleVars: CSSProperties | undefined =
    color != null ? { ['--dots-loader-color' as string]: color } : undefined;

  return (
    <span
      className={`${styles.wrapper} ${sizeClass} ${className}`.trim()}
      style={styleVars}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Full-width section with centered dots + optional caption (route loading fallbacks).
 */
export function DotsLoaderBlock({
  caption = 'Loading…',
  minHeight = '50vh',
  className = '',
}: {
  caption?: string;
  minHeight?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 px-4 ${className}`.trim()}
      style={{
        minHeight,
        background: 'var(--color-bg)',
        color: 'var(--color-text-muted)',
      }}
    >
      <DotsLoader size="lg" />
      {caption ? (
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}
