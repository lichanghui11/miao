interface PropsType {
  id: string | number;
  text: string;
  completed: boolean;
  onChange: () => void;
  onClick: () => void;
}
export default function TodoItem(props: PropsType) {
  console.log(props.completed);
  return (
    <li>
      <input
        onChange={props.onChange}
        checked={props.completed}
        type="checkbox"
      />
      <span> {props.text}</span>
      <button onClick={props.onClick}>&times;</button>
    </li>
  );
}
