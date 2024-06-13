import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface UserCardProps {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

const ClientCard: React.FC<UserCardProps> = ({ nombre, apellido, telefono, email }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              <strong>Información del Usuario</strong> 
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1">
        <strong> Nombre:</strong> {nombre}
        </Typography>
        <Typography variant="body1">
        <strong>Apellido:</strong> {apellido}
        </Typography>
        <Typography variant="body1">
        <strong>Teléfono:</strong> {telefono}
        </Typography>
        <Typography variant="body1">
        <strong>Email: </strong> {email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
