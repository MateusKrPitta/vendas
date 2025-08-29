import React, { useState } from "react";
import {
  Mail,
  Password,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import Financeiro from "../../assets/png/logo.png";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import CustomToast from "../../components/toast";
import { login } from "../../service/post/login";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      CustomToast({
        type: "error",
        message: "Por favor, preencha todos os campos",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, senha);

      if (response.status) {
        const { token, user } = response.data;

        localStorage.setItem(
          "user",
          JSON.stringify({
            token: token.token,
            fullName: user.fullName,
            tipo: user.tipo,
            unidades: user.unidades,
          })
        );

        CustomToast({
          type: "success",
          message: "Seja bem vindo!",
        });

        navigate("/dashboard", { replace: true });
      } else {
        CustomToast({
          type: "error",
          message: response.message || "Erro no login",
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      CustomToast({
        type: "error",
        message:
          error.response?.data?.message || "Erro ao conectar com o servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(270deg, #0d2d43, #133b5c, #0d2d43)",
        backgroundSize: "600% 600%",
        animation: "gradient 15s ease infinite",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          bgcolor: "white",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            mb: 3,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Financeiro}
            alt="Logo"
            style={{ width: "120px", borderRadius: "8px" }}
          />
        </Box>

        {/* Campo de email */}
        <TextField
          fullWidth
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Campo de senha */}
        <TextField
          fullWidth
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOffOutlined sx={{ color: "#0d2d43" }} />
                  ) : (
                    <VisibilityOutlined sx={{ color: "#0d2d43" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <Password fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Botão entrar */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            py: 1.5,
            mb: 2,
            backgroundColor: "#588152",
            fontWeight: "600",
            "&:hover": { backgroundColor: "#476a41" },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
        </Button>

        <label className="text-xs text-primary mt-4 font-bold">
          Versão {packageJson.version}
        </label>
      </Paper>
    </Box>
  );
};

export default LoginPage;
