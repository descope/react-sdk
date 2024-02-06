import React from 'react';
import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import StepUp from './StepUp';
import ManageUsers from './ManageUsers';

const Layout = () => (
	<div style={{ height: '100vh', position: 'relative' }}>
		<div
			style={{
				borderRadius: 10,
				margin: 'auto',
				border: '1px solid lightgray',
				padding: 20,
				maxWidth: '600px',
				boxShadow: '13px 13px 20px #cbced1, -13px -13px 20px #fff',
				background: '#ecf0f3',
				position: 'relative',
				top: '50%',
				transform: 'translateY(-50%)'
			}}
		>
			<Outlet />
		</div>
	</div>
);

const App = () => (
	<Routes>
		<Route element={<Layout />}>
			<Route index element={<Home />} />
			<Route path="/user-management" element={<ManageUsers />} />
			<Route path="/login" element={<Login />} />
			<Route path="/step-up" element={<StepUp />} />
		</Route>
	</Routes>
);

export default App;
