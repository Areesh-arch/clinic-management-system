function EmptyState({ text }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">

      <h3 className="text-slate-700 font-semibold">
        {text}
      </h3>

    </div>
  );
}

export default EmptyState;