import './icons.css';

export default function UserIcon(): React.ReactNode {
    return <svg
        viewBox="2 2 20 20"
        style={{
            width: 24,
            height: 24
        }}
        fill={'white'}
        className={'svg-icon user'}
    >
        <circle
            cx="12"
            cy="5.5"
            r="2.5">
        </circle>
        <path
            d="M15 10H9a4 4 0 0 0-4 4v7h14v-7a4 4 0 0 0-4-4z"
        ></path>
    </svg>;
}
