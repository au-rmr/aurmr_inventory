import React from "react";
import "../styles/home.css";
import * as Constants from "../Constants";

import {Link} from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function Home() {
    // async function getAllProductsQuery() {
    //     const allProds = await fetch("")
    // }

    return (
        <div id="overall">
            <h1>Home - View all Inventory</h1>
            {Constants.rows.map((row, i) => (
                <Card key={i} sx={{ maxWidth: 345, display: "inline-block", margin: "10px" }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image={row.picUrl}
                            alt={row.name}
                            style={{ width: "200px", height: "200px", objectFit: "contain" }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {row.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {row.name}
                                <Table size="small" aria-label="a dense table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Price</TableCell>
                                            <TableCell>{row.price}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Width</TableCell>
                                            <TableCell>{row.width_size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Length</TableCell>
                                            <TableCell>{row.length_size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Height</TableCell>
                                            <TableCell>{row.height_size}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Units</TableCell>
                                            <TableCell>{row.size_units}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Link to={`/product/${row.id}`}>View Details</Link>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}

export default Home;