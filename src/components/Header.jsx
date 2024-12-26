import useStore from './store';

const Header = () => {
  const { title, setTitle } = useStore();

  const changeTitle = () => {
    setTitle('새 헤더 제목');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 border-b border-gray-300">
      <h1 className="text-xl font-semibold">{title}</h1>
      <button
        onClick={changeTitle}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >

      </button>
    </header>
  );
};

export default Header;