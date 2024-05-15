'use client';

export default function CharField(
    {
        name,
        placeholder,
        errors
    }: {
        name: string;
        placeholder: string;
        errors?: string[]
    }
) {
    const verbose = name.charAt(0).toUpperCase() + name.slice(1);

    return <div className="field-wrapper">
        <label
            htmlFor={name}
        >
            {verbose}
        </label>
        <ul
            className="form-errors"
        >
            {errors?.map((error, key) =>
                <li
                    className="form-error"
                    key={key}
                >
                    {error}
                </li>
            )}
        </ul>
        <input
            className="field-input"
            type="text"
            id={name}
            name={name}
            placeholder={placeholder}
            required
        />
    </div>;
}
