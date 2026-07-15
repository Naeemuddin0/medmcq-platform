const ProgressBar = ({ progress, color }) => {
  return (
    <div className="h-2 w-full rounded-full bg-line dark:bg-white/10">
      <div
        className="h-2 rounded-full transition-[width] duration-300"
        style={{ width: `${progress}%`, backgroundColor: color || '#0f6657' }}
      ></div>
    </div>
  );
};

export default ProgressBar;
