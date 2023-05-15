import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import { useState, useRef } from 'react';
import type { LoginData } from '@eweser/db';
import {
  validateHomeserver,
  validatePassword,
  validateUsername,
} from '@eweser/db';

import { useDatabase } from '../DatabaseContext';
import { DEV_USERNAME, DEV_PASSWORD, MATRIX_SERVER } from '../config';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export interface LoginFormProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setId: (id: number) => void;
}
type FormField = keyof LoginData;

export interface Props {
  handleLogin: (loginData: LoginData) => void;
  handleSignup: (loginData: LoginData) => void;
}

const initialLoginData: LoginData = {
  baseUrl: MATRIX_SERVER,
  userId: DEV_USERNAME, // these will be empty in prod. This speeds up dev time by prefilling the login form
  password: DEV_PASSWORD,
};

export const LoginForm = () => {
  const { db, errorMessage } = useDatabase();

  const [action, setAction] = useState<'Login' | 'Sign up'>('Sign up');
  const [loginData, setLoginData] = useState(initialLoginData);
  const [error, setError] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [homeserverError, setHomeserverError] = useState('');

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: FormField, value: string) => {
    if (field === 'baseUrl')
      try {
        validateHomeserver(value);
        setHomeserverError('');
      } catch (error: any) {
        setHomeserverError(error.message || 'unknown error');
      }
    else if (field === 'userId') {
      try {
        validateUsername(value || '');
        setUsernameError('');
      } catch (error: any) {
        setUsernameError(error.message || 'unknown error');
      }
    } else if (field === 'password') {
      try {
        validatePassword(value);
        setPasswordError('');
      } catch (error: any) {
        setPasswordError(error.message || 'unknown error');
      }
    }
    const loginDataChange = {
      ...loginData,
      [field]: value,
    };
    setLoginData(loginDataChange);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (action === 'Login') {
        const loginResult = db.login(loginData);
        if (typeof loginResult === 'string') {
          setError(loginResult);
        }
      } else {
        const signupResult = await db.signup(loginData);
        if (typeof signupResult === 'string') {
          setError(signupResult);
        }
      }
    } catch (error: any) {
      setError(error.message || 'unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const hasSubmitError = errorMessage !== '' || error !== '';

  const { baseUrl, userId, password } = loginData;

  const requiredEmpty = baseUrl === '' || userId === '' || password === '';

  const submitDisabled = requiredEmpty || requiredEmpty || submitting;

  return (
    <Paper sx={{ width: { xs: '100%', md: 'auto' }, margin: { xs: 2, md: 4 } }}>
      <Box
        accessibility-role="form"
        sx={{
          '& .MuiTextField-root': {
            my: 4,
            width: { xs: '100%', md: '45ch' },
            display: 'flex',
          },
        }}
        padding={{ xs: 2, md: 4 }}
      >
        <Typography sx={{ mt: 2 }} variant="h4" gutterBottom>
          {action}
        </Typography>

        <TextField
          required
          error={homeserverError !== ''}
          helperText={homeserverError}
          label="Homeserver"
          placeholder="Where your matrix account was created, e.g. 'https://matrix.org'"
          onChange={(e) => handleChange('baseUrl', e.target.value)}
          value={baseUrl}
          onKeyPress={(e) => {
            if (e.key === 'Enter') usernameRef.current?.focus();
          }}
        />
        <TextField
          required
          error={usernameError !== ''}
          helperText={usernameError}
          type="text"
          label="Username"
          placeholder="e.g. 'jacob' if your full username is '@jacob:matrix.org'"
          onChange={(e) => handleChange('userId', e.target.value)}
          value={userId}
          inputRef={usernameRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') passwordRef.current?.focus();
          }}
        />
        <TextField
          required
          error={passwordError !== ''}
          helperText={passwordError}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          label="Password"
          onChange={(e) => handleChange('password', e.target.value)}
          value={password}
          inputRef={passwordRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') buttonRef.current?.focus();
          }}
        />

        <Button
          color="primary"
          variant="contained"
          disabled={submitDisabled}
          onClick={handleSubmit}
          ref={buttonRef as any}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          sx={{ minWidth: '12ch' }}
        >
          {action}
        </Button>
        <Button
          onClick={() => {
            setAction(action === 'Login' ? 'Sign up' : 'Login');
          }}
          sx={{ ml: 2 }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {action === 'Login' ? 'Sign up' : 'Login'}
          </Typography>
        </Button>

        <Typography
          sx={{ mt: 1 }}
          variant="subtitle2"
          color={hasSubmitError ? 'error' : 'textSecondary'}
        >
          {errorMessage}&nbsp;
          {error}&nbsp;
        </Typography>
      </Box>
    </Paper>
  );
};
