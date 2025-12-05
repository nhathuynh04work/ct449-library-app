import { ref } from "vue";

export function useSmartPosition() {
    const position = ref<"bottom" | "top">("bottom");

    const calculatePosition = (element: HTMLElement | null, dropdownHeight = 250) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;

        // If space below is less than dropdown height AND space above is greater, flip to top
        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
            position.value = "top";
        } else {
            position.value = "bottom";
        }
    };

    return {
        position,
        calculatePosition,
    };
}
