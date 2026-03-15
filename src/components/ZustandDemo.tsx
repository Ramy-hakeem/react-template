import { useCounterStore } from "../lib/stores";

export function ZustandDemo() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div className="mb-6 rounded-lg border border-slate-200 p-4">
      <h2 className="mb-2 text-lg font-semibold">Zustand Demo</h2>
      <p className="text-sm text-slate-600">
        This component uses a Zustand store. The counter state is shared, so
        it can be reused across the app.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded bg-slate-800 px-3 py-1 text-white hover:bg-slate-900"
          onClick={decrement}
          type="button"
        >
          -
        </button>
        <span className="min-w-[2rem] text-center font-medium">{count}</span>
        <button
          className="rounded bg-slate-800 px-3 py-1 text-white hover:bg-slate-900"
          onClick={increment}
          type="button"
        >
          +
        </button>
        <button
          className="rounded border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-50"
          onClick={reset}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
