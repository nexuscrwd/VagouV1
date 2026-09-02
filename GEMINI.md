# 📜 Diretrizes do Assistente Gemini — Vagou

Este arquivo replica e reforça as diretrizes mestras do projeto **Vagou** para consumo nativo do Gemini.

Consulte o arquivo principal completo em `AGENTS.md` e a documentação técnica complementar:
- `ARCHITECTURE.md` (Arquitetura e tecnologias)
- `KNOWLEDGE_BASE.md` (Soluções técnicas validadas e boas práticas)
- `CHANGELOG.md` (Registro cronológico de alterações)

---

### Regras de Ouro:
1. **Consulte a documentação `.md`** antes de propor ou executar qualquer modificação.
2. **Analise, reestruture e confirme** a solicitação do usuário antes de codificar.
3. **Nunca faça nada além do solicitado** (respeito estrito ao escopo).
4. **Alerta proativo**: Avise sobre incoerências, conflitos de design ou inviabilidades técnicas.
5. **Limpeza Pós-Obra (Clean Code)**: Deixe o código 100% livre de imports mortos, variáveis sem uso ou estilos conflitantes.
6. **Validação**: Execute `lint_applet` e `compile_applet` antes de dar o trabalho por encerrado.
