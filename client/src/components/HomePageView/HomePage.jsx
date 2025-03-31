import { Box, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";

const HomePage = () => {
    return (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 8 }}>
            {/* Hero Section */}
            <Typography variant="h2" fontWeight="600" gutterBottom>
                Welcome to Task Management
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Organize your tasks efficiently with an intuitive dashboard and table view.
            </Typography>

            {/* Quick Navigation */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    color="primary"
                    startIcon={<DashboardIcon />}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Go to Dashboard
                </Button>
                <Button
                    component={Link}
                    to="/table"
                    variant="outlined"
                    color="secondary"
                    startIcon={<TableChartIcon />}
                    sx={{ px: 4, py: 1.5 }}
                >
                    View Tasks Table
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;
