'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/user';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, recoverByToken } = useAuth();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'A senha deve conter pelo menos um número';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validar senha forte apenas no registro
      if (isRegistering) {
        const passwordError = validatePassword(credentials.password);
        if (passwordError) {
          setError(passwordError);
          setIsLoading(false);
          return;
        }
      }

      const result = isRegistering 
        ? await register(credentials)
        : await login(credentials);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError('Erro interno do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await recoverByToken(recoveryToken);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Token inválido');
      }
    } catch (err) {
      setError('Erro ao recuperar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCredentials({ username: '', password: '' });
    setRecoveryToken('');
    setError('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const switchToRecovery = () => {
    setShowRecovery(!showRecovery);
    resetForm();
  };

  if (showRecovery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Recuperar Conta</CardTitle>
              <CardDescription>
                Digite seu token de recuperação para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecovery} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Token de recuperação"
                    value={recoveryToken}
                    onChange={(e) => setRecoveryToken(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading || !recoveryToken.trim()}
                >
                  {isLoading ? 'Recuperando...' : 'Recuperar Conta'}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={switchToRecovery}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Voltar ao login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {isRegistering ? (
                <UserPlus className="w-6 h-6 text-primary" />
              ) : (
                <LogIn className="w-6 h-6 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? 'Crie sua conta para começar a organizar suas notas'
                : 'Entre com suas credenciais para acessar suas notas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Nome de usuário"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || !credentials.username.trim() || !credentials.password.trim()}
              >
                {isLoading ? (
                  isRegistering ? 'Criando conta...' : 'Entrando...'
                ) : (
                  isRegistering ? 'Criar Conta' : 'Entrar'
                )}
              </Button>

              <div className="space-y-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={switchMode}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {isRegistering 
                    ? 'Já tem uma conta? Entrar'
                    : 'Não tem uma conta? Criar conta'
                  }
                </Button>
                
                {!isRegistering && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={switchToRecovery}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Recuperar conta com token
                  </Button>
                )}
              </div>
            </form>


          </CardContent>
        </Card>
      </motion.div>
  );
}