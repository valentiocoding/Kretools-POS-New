const InputWithIcon = ({ type = "text", placeholder = "Enter value", icon, value, onChange }) => {
  return (
    <div className="relative max-w-xs w-full">
      <div className="absolute left-3 inset-y-0 flex items-center text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputWithIcon;
