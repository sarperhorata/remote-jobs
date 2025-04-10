import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const Pricing = () => {
  const features = [
    { name: 'Sınırsız İş İlanı Görüntüleme', free: 'Hayır', premium: 'Evet' },
    { name: 'Günlük Bildirimler', free: 'Hayır', premium: 'Evet' },
    { name: 'Otomatik Başvuru Hazırlama', free: 'Hayır', premium: 'Evet' },
    { name: 'Özel İş Eşleştirme', free: 'Hayır', premium: 'Evet' },
    { name: 'Reklamsız Deneyim', free: 'Hayır', premium: 'Evet' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pricing
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Özellik</TableCell>
              <TableCell align="right">Free</TableCell>
              <TableCell align="right">Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell component="th" scope="row">
                  {feature.name}
                </TableCell>
                <TableCell align="right">{feature.free}</TableCell>
                <TableCell align="right">{feature.premium}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Pricing; 