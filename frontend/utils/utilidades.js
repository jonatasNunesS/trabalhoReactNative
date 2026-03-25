export function getInitials (text = ""){
    return text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };
  
  export function formatDateTime (value)  {
      if (!value) return "25/03/2026 - 14:00";
  
      const date = new Date(value);
  
      if (Number.isNaN(date.getTime())) {
        return value;
      }
  
      const formattedDate = date.toLocaleDateString("pt-BR");
      const formattedTime = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} - ${formattedTime}`;
    };
  
    export function formatPrice (value) {
      if (typeof value !== "number") return "R$ 0,00";
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };