// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline, { TimelineProps } from "@mui/lab/Timeline";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiTimelineItem-root": {
    width: "100%",
    "&:before": {
      display: "none",
    },
  },
});

const accountLogHistory = [
  {
    id: 1,
    title: "Package 1 has been purchased",
    description: "description",
    date: "Wednesday",
    type: "Purchase",
  },
  {
    id: 2,
    title: "Package 1 has been purchased",
    description: "description",
    date: "Wednesday",
    type: "Purchase",
  },
  {
    id: 3,
    title: "Package 1 has been purchased",
    description: "description",
    date: "Wednesday",
    type: "Purchase",
  },
];

const EcommerceActivityTimeline = () => {
  return (
    <Card>
      <CardHeader
        title="Hesap log dökümü"
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(2.5)} !important` }}>
        <Timeline sx={{ my: 0, py: 0 }}>
          {accountLogHistory.map((val, i) => {
            return (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="error" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    mt: 0,
                    mb: (theme) => `${theme.spacing(3)} !important`,
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 600 }}>
                      {val.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      {val.date.toString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {val.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 2, fontWeight: 600 }}
                    >
                      Type: {val.type}
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default EcommerceActivityTimeline;
