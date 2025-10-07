type FilterHeaderProps = {
  title: string;
  qnty: number;
  textcolor: string; 
  boxcolor: string;  
};

export default function FilterHeader({ title, qnty, textcolor, boxcolor }: FilterHeaderProps) {
  
  const isTextHex = textcolor.startsWith("#");
  const isBoxHex = boxcolor.startsWith("#");

  return (
    <div
      className={`flex justify-center items-center gap-[10px] p-[10px] border-b-[2px] hover:bg-gray-100 cursor-pointer transition-all rounded-t-xl ${
        isTextHex ? "" : `border-${textcolor}`
      }`}
      style={isTextHex ? { borderColor: textcolor } : {}}
    >
      <p
        className={`body-regular ${isTextHex ? "" : `text-${textcolor}`}`}
        style={isTextHex ? { color: textcolor } : {}}
      >
        {title}
      </p>

      <div
        className={`flex justify-center size-[30px] items-center rounded-[12px] p-[7px] ${
          isBoxHex ? "" : `bg-${boxcolor}`
        }`}
        style={isBoxHex ? { backgroundColor: boxcolor } : {}}
      >
        <p
          className={`body-regular ${isTextHex ? "" : `text-${textcolor}`}`}
          style={isTextHex ? { color: textcolor } : {}}
        >
          {qnty}
        </p>
      </div>
    </div>
  );
}
