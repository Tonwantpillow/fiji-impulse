export default function TextFieldForm({prompt} : {prompt: string}){
  return (
    <div>
      <p className="text-white">{prompt}</p>
      <input placeholder={prompt} className="w-full bg-white px-[16px] py-[12px] rounded-[8px]">
      </input>
    </div>
  )
}