import { useContext, useMemo, useCallback } from 'react';
import { CarbonContext } from '../context/CarbonContext';

/**
 * Custom hook to consume CarbonContext values and perform calculations.
 * This hook acts as the logical bridge for all three core objectives:
 * 
 * 1. **UNDERSTAND**: Memoizes carbon emission totals, percentage category breakdown,
 *    and target budget status to feed graphical displays.
 * 2. **TRACK**: Provides interfaces (`addActivity`, `removeActivity`, `addScannedItem`) 
 *    to log emissions events and purchase behaviors.
 * 3. **REDUCE**: Exposes reward claim actions (`claimChallenge`) and reset utilities to help
 *    users lower their carbon footprint.
 */
export function useCarbon() {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }

  const { state, dispatch } = context;

  // Memoize total emissions calculations to optimize re-rendering
  const totals = useMemo(() => {
    const categories = { transport: 0, energy: 0, food: 0, shopping: 0 };
    let total = 0;

    state.activities.forEach(act => {
      if (categories[act.category] !== undefined) {
        categories[act.category] += act.emissions;
        total += act.emissions;
      }
    });

    // Calculate percentage breakdown
    const breakdownPercentages = {};
    Object.keys(categories).forEach(cat => {
      breakdownPercentages[cat] = total > 0 ? Math.round((categories[cat] / total) * 100) : 0;
    });

    const isOverBudget = total > state.profile.target;
    const budgetUsagePercentage = state.profile.target > 0 
      ? Math.min(100, Math.round((total / state.profile.target) * 100))
      : 0;

    return {
      categoryTotals: categories,
      grandTotal: parseFloat(total.toFixed(2)),
      breakdownPercentages,
      isOverBudget,
      budgetUsagePercentage,
      targetBudget: state.profile.target
    };
  }, [state.activities, state.profile.target]);

  // Wrapped actions with useCallback for performance stability
  const addActivity = useCallback((activityPayload) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activityPayload });
  }, [dispatch]);

  const removeActivity = useCallback((activityId) => {
    dispatch({ type: 'REMOVE_ACTIVITY', payload: activityId });
  }, [dispatch]);

  const claimChallenge = useCallback((challengeId) => {
    dispatch({ type: 'CLAIM_CHALLENGE', payload: challengeId });
  }, [dispatch]);

  const addScannedItem = useCallback((itemPayload) => {
    dispatch({ type: 'ADD_SCANNED_ITEM', payload: itemPayload });
  }, [dispatch]);

  const updateProfile = useCallback((profilePayload) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profilePayload });
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  return {
    profile: state.profile,
    activities: state.activities,
    challenges: state.challenges,
    scannedItems: state.scannedItems,
    badges: state.badges,
    points: state.points,
    totals,
    addActivity,
    removeActivity,
    claimChallenge,
    addScannedItem,
    updateProfile,
    resetState
  };
}
export default useCarbon;
