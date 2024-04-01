import { w, W } from "windstitch";

export const Button = w.button(
    `
    rounded-lg
    px-4 py-2
    `,
    {
        variants: {
            buttonType: {
                primary: `
                    bg-red-500
                    text-white
                `,
                transparent: `
                    bg-transparent
                    border
                    border-red-700
                `
            }
        },
        defaultVariants: {
            buttonType: 'primary'
        },
    }
);

export type ButtonProps = W.Infer<typeof Button>;