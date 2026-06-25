import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2F5DAA" },
    background: { default: "#F4F6F9" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});
