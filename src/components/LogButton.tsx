type LogButtonProp = {
    label: string;
    onClick: () => void;
};

function LogButton({label, onClick}: LogButtonProp) {
    return <button onClick={onClick}>{label}</button>
}

export default LogButton