const TWInlineCircleSpinner = () => {
  return (
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-0 border-b-0 border-black rounded-full" role="status">
      <span className="invisible">Loading...</span>
    </div>
  )
}

export default TWInlineCircleSpinner;