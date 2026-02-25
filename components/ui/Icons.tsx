import type { SVGProps } from 'react';

const sizeClass = (s?: 'sm' | 'md' | 'lg') => (s === 'sm' ? 'h-5 w-5' : s === 'lg' ? 'h-10 w-10' : 'h-6 w-6');

export function IconRocket(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

export function IconChart(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

export function IconUsers(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

export function IconShield(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

export function IconCode(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

export function IconChat(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

export function IconScale(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  );
}

export function IconSparkles(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

export function IconArrowRight(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export function IconBriefcase(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  );
}

export function IconCpu(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  );
}

export function IconHeadset(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size, className, ...rest } = props;
  return (
    <svg className={`${sizeClass(size)} ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
