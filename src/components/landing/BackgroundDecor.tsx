export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(13,148,136,0.18),_transparent_60%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.12),_transparent_70%)] blur-3xl" />
    </div>
  );
}
