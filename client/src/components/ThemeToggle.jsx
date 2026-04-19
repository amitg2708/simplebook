import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const themes = [
    { key: 'light', icon: '☀️', label: 'Light' },
    { key: 'dark', icon: '🌙', label: 'Dark' },
    { key: 'gradient', icon: '🎨', label: 'Gradient' },
  ];

  return (
    <div className="theme-toggle">
      {themes.map(({ key, icon }) => (
        <button
          key={key}
          className={`theme-btn ${theme === key ? 'active' : ''}`}
          onClick={() => toggleTheme(key)}
          title={key}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
