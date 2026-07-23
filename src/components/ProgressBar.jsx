
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-[6px] h-3 border border-gray-300 dark:border-gray-700">
      <div
        className="h-3 rounded-[6px] bg-gray-900 dark:bg-white"
        style={{ width: `${progress}%`, transition: 'width 0.2s' }}
      ></div>
    </div>
  );
};

export default ProgressBar; 