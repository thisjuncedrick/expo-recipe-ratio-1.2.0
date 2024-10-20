// TimerContext.tsx

import React from 'react';

/**
 * TimerContextType defines the shape of the TimerContext.
 *
 * @typedef {Object} TimerContextType
 * @property {boolean} isRunning - Indicates whether the timer is currently running.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsRunning - Function to update the `isRunning` state.
 */
interface TimerContextType {
	isRunning: boolean;
	setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * TimerContext provides access to the timer's state and the ability to update it.
 * The context is initialized with `undefined` as the default value.
 */
export const TimerContext = React.createContext<TimerContextType | undefined>(undefined);

/**
 * Custom hook that provides access to the TimerContext.
 * Throws an error if the hook is used outside a TimerProvider.
 *
 * @returns {TimerContextType} - The current context value (isRunning, setIsRunning).
 * @throws Will throw an error if used outside a TimerProvider.
 */
export function useTimerContext(): TimerContextType {
	// Retrieve the TimerContext value
	const context = React.useContext(TimerContext);

	// Throw an error if no context is found (i.e., if the hook is not used within a TimerProvider)
	if (context === undefined) {
		throw new Error('useTimerContext must be used within a TimerProvider');
	}

	return context;
}
