import { User, Camera, Save, Eye, EyeOff, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências da conta
        </p>
      </div>

      {/* Profile Picture */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Foto do Perfil</CardTitle>
          <CardDescription>
            Atualize sua foto para personalizar seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  JS
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">João Silva</h3>
              <p className="text-sm text-muted-foreground">joao.silva@empresa.com</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border hover:bg-accent/50">
                  Alterar Foto
                </Button>
                <Button variant="outline" size="sm" className="border-border hover:bg-accent/50 text-red-400 border-red-500/20">
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize seus dados pessoais e informações de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground">Nome</Label>
              <Input 
                id="firstName"
                defaultValue="João"
                className="bg-card border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground">Sobrenome</Label>
              <Input 
                id="lastName"
                defaultValue="Silva"
                className="bg-card border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input 
              id="email"
              type="email"
              defaultValue="joao.silva@empresa.com"
              className="bg-card border-border text-foreground"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Telefone</Label>
              <Input 
                id="phone"
                defaultValue="+55 11 99999-0000"
                className="bg-card border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">Empresa</Label>
              <Input 
                id="company"
                defaultValue="Minha Empresa Ltda"
                className="bg-card border-border text-foreground"
              />
            </div>
          </div>

          <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Segurança</CardTitle>
          <CardDescription>
            Gerencie sua senha e configurações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-foreground">Senha Atual</Label>
            <div className="relative">
              <Input 
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                className="bg-card border-border text-foreground pr-10"
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground">Nova Senha</Label>
            <div className="relative">
              <Input 
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="bg-card border-border text-foreground pr-10"
                placeholder="Digite sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Nova Senha</Label>
            <Input 
              id="confirmPassword"
              type="password"
              className="bg-card border-border text-foreground"
              placeholder="Confirme sua nova senha"
            />
          </div>

          <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
            Atualizar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Preferências</CardTitle>
          <CardDescription>
            Configure idioma, moeda e outras preferências
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground">Idioma</Label>
              <Select defaultValue="pt-br">
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="pt-br">🇧🇷 Português (Brasil)</SelectItem>
                  <SelectItem value="en-us">🇺🇸 English (US)</SelectItem>
                  <SelectItem value="es-es">🇪🇸 Español (España)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Moeda</Label>
              <Select defaultValue="brl">
                <SelectTrigger className="bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="brl">R$ Real Brasileiro</SelectItem>
                  <SelectItem value="usd">$ Dólar Americano</SelectItem>
                  <SelectItem value="eur">€ Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Fuso Horário</Label>
            <Select defaultValue="america-sao_paulo">
              <SelectTrigger className="bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="america-sao_paulo">(GMT-3) São Paulo, Brasília</SelectItem>
                <SelectItem value="america-new_york">(GMT-4) New York</SelectItem>
                <SelectItem value="europe-london">(GMT+0) Londres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Configurações de Interface</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-foreground">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre tema claro e escuro
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-foreground">Notificações Desktop</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações no desktop
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-foreground">Sons de Notificação</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir sons ao receber notificações
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow">
            <Save className="w-4 h-4 mr-2" />
            Salvar Preferências
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}