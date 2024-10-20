import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { Appbar } from 'react-native-paper';
import { DB_NAME } from '../constants';

export const DBSaveButton = () => {
	const getFileName = () => {
		const now = new Date();

		const datePart = now
			.toLocaleString('en-US', {
				year: '2-digit',
				month: '2-digit',
				day: '2-digit',
			})
			.replace(/[\/]/g, '');

		const timePart = now
			.toLocaleString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			})
			.replace(/[:\s]/g, '');

		return `${DB_NAME.replace('_db.db', '')}_${datePart}_${timePart}.db`;
	};
	const copyDatabaseToDownloads = async () => {
		const databaseUri = FileSystem.documentDirectory + `SQLite/${DB_NAME}`;
		const fileName = getFileName();

		await Sharing.shareAsync(databaseUri, { dialogTitle: 'share or copy your DB via' }).catch((error) => {
			console.log(error);
		});
	};

	return <Appbar.Action icon='database-export' onPress={copyDatabaseToDownloads} />;
};

export const DBDeleteButton = () => {
	const handleDBDelete = () => {
		console.log('DB DELETED');
		ToastAndroid.show('Database deleted', ToastAndroid.SHORT);
	};

	return <Appbar.Action icon='delete-empty' onPress={handleDBDelete} />;
};
