import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import { Link, Redirect } from 'react-router-dom';
import noImage from '../img/no-img.jpeg';
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	makeStyles,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '5px',
		borderRadius: 5,
		border: '1px solid #e23636',
		boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
	},
	titleHead: {
		fontWeight: 'bold',
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row',
	},
	media: {
		height: '100%',
		width: '100%',
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12,
	},
	pagination: {
		display: 'flex',
		justifyContent: 'left',
		margin: '10px 20px 20px 20px',
	},
});

const CharactersList = (props) => {
	const classes = useStyles();
	const [charactersList, setCharactersList] = useState([]);
	const [responseData, setResponseData] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	let card = null;

	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			let pageNum = props.match.params.page;

			if (parseInt(pageNum) < 0 || pageNum.match(/^[0-9]+$/) == null) {
				setCharactersList([]);
				setLoading(false);
			} else {
				try {
					setLoading(true);
					const getUrl = buildUrl();
					const { data } = await axios.get(getUrl);
					setCharactersList(data.data.results);
					setResponseData(data.data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
		}
		fetchData();
		return () => {
			setSearchTerm('');
		};
		// eslint-disable-next-line
	}, [props.match.params.page]);

	// ----- normal url -----
	// https://gateway.marvel.com/v1/public/characters?ts=1603765329105&apikey=636ac89ea1be55acb2fcda6ad6a8b9d6&hash=87956e978fa1fc478778fb39201a049f
	// ----- url with offset and limit -----
	// https://gateway.marvel.com/v1/public/characters?limit=20&offset=20&ts=1603765329105&apikey=636ac89ea1be55acb2fcda6ad6a8b9d6&hash=87956e978fa1fc478778fb39201a049f

	const buildUrl = () => {
		const md5 = require('blueimp-md5');
		const publickey = 'd70843301e9585ccbac7cd234cc1938d';
		const privatekey = '7482747fcb7c1263ed90d7327bcfc9ace1008de0';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/characters';
		let url = '';
		let pageNum = props.match.params.page;
		let offset = parseInt(pageNum) * 20;

		if (pageNum === '0') {
			url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
		} else {
			url =
				baseUrl +
				'?limit=20&offset=' +
				offset +
				'&ts=' +
				ts +
				'&apikey=' +
				publickey +
				'&hash=' +
				hash;
		}

		return url;
	};

	const searchValue = async (value) => {
		setSearchTerm(value);
	};

	const paginationButtons = () => {
		let pageNum = props.match.params.page;
		let lastPageDec = parseInt(responseData.total) / 20;
		let lastPage = Math.floor(lastPageDec);
		if (lastPageDec - lastPage <= 0) {
			lastPage = lastPage - 1;
		}

		if (searchTerm) {
			return <div></div>;
		} else if (pageNum === '0') {
			return (
				<div className={classes.pagination}>
					<Link
						to={`/characters/page/${parseInt(props.match.params.page) + 1}`}
						className="pageBtns nextBtn"
					>
						Next Page
					</Link>
				</div>
			);
		} else if (parseInt(pageNum) === lastPage) {
			return (
				<div className={classes.pagination}>
					<Link
						to={`/characters/page/${parseInt(props.match.params.page) - 1}`}
						className="pageBtns prevBtn"
					>
						Previous Page
					</Link>
				</div>
			);
		} else {
			return (
				<div className={classes.pagination}>
					<Link
						to={`/characters/page/${parseInt(props.match.params.page) - 1}`}
						className="pageBtns prevBtn"
					>
						Previous Page
					</Link>
					<Link
						to={`/characters/page/${parseInt(props.match.params.page) + 1}`}
						className="pageBtns nextBtn"
					>
						Next Page
					</Link>
				</div>
			);
		}
	};

	const buildCard = (character) => {
		let charImgUrl = '';

		if (character.thumbnail.path && character.thumbnail.extension) {
			charImgUrl =
				character.thumbnail.path +
				'/standard_xlarge.' +
				character.thumbnail.extension;
		}

		return (
			<Grid item xs={12} sm={10} md={4} lg={3} xl={2} key={character.id}>
				<Card className={classes.card} variant="outlined">
					<CardActionArea>
						<Link to={`/characters/${character.id}`}>
							<CardMedia
								className={classes.media}
								component="img"
								image={charImgUrl ? charImgUrl : noImage}
								title={character.name + ' image'}
							/>

							<CardContent>
								<Typography
									className={classes.titleHead}
									gutterBottom
									variant="h6"
									component="h2"
								>
									{character.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (charactersList) {
		card =
			charactersList &&
			charactersList.map((character) => {
				return buildCard(character);
			});
	}

	if (loading) {
		return (
			<div>
				<CircularProgress />
				<h1>Loading the characters...</h1>
			</div>
		);
	} else if (searchTerm) {
		return <Redirect to={'/search/characters/' + searchTerm}></Redirect>;
	} else if (charactersList.length === 0) {
		return (
			<Redirect
				to={'/error/characterList?page=' + props.match.params.page}
			></Redirect>
		);
	} else {
		return (
			<div>
				<Search searchValue={searchValue} />
				{paginationButtons()}
				<Grid container className={classes.grid} spacing={3}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default CharactersList;
