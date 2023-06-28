export const Tag = ({ text, color }: { text: string, color: string }) => {

  return <div className="flex items-center justify-center " style={{
    padding: "2px 4px",
    borderRadius: "4px",
    backgroundColor: color,
    color: "#fff",
    fontSize: "12px",

  }}>{text}</div>
}