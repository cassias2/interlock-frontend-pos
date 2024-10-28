import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
interface Props {
  title?: string;
  label: string;
  color?: string;
}

const ProductInfo = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack
      alignItems="center"
      spacing={isMobile ? 1 : 2}
      sx={{
        padding: isMobile ? "8px" : "16px",
      }}
    >
      {props.title && (
        <Typography
          variant={isMobile ? "subtitle2" : "subtitle1"}
          fontWeight="bold"
        >
          {props.title}
        </Typography>
      )}
      <Typography
        fontWeight={props?.color ? "bold" : "normal"}
        color={props.color ?? "#151616"}
        variant={isMobile ? "body2" : "body1"}
      >
        {props.label}
      </Typography>
    </Stack>
  );
};

export default ProductInfo;
