
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 shadow-inner">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 shadow"
        style={{ width: `${progress}%`, transition: 'width 0.4s' }}
      ></div>
    </div>
  );
};

export default ProgressBar; 