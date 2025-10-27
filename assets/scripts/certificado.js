const SENHA_SISTEMA = "123";

// Verifica a senha antes de liberar o formulário
document.getElementById("verificarSenha").addEventListener("click", () => {
    const senhaDigitada = document.getElementById("senhaInput").value.trim();

    if (senhaDigitada === SENHA_SISTEMA) {
        document.getElementById("senha-section").style.display = "none";
        document.getElementById("certificado-section").style.display = "block";
    } else {
        alert("Senha incorreta! Tente novamente.");
    }
});

// Gera o certificado
document.getElementById("certificadoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const data = document.getElementById("data").value;
    const foto = document.getElementById("foto").files[0];

    const certNome = document.getElementById("certNome");
    const certData = document.getElementById("certData");
    const certFoto = document.getElementById("certFoto");
    const certificado = document.getElementById("certificado");

    certNome.textContent = `${nome}, ${idade} anos`;
    certData.textContent = `Data: ${new Date(data).toLocaleDateString("pt-BR")}`;

    if (foto) {
        const reader = new FileReader();
        reader.onload = e => certFoto.src = e.target.result;
        reader.readAsDataURL(foto);
    } else {
        certFoto.src = "";
    }

    certificado.style.display = "block";
    document.getElementById("baixarCertificado").style.display = "block";
});

// Baixar certificado como imagem
document.getElementById("baixarCertificado").addEventListener("click", async () => {
    const certificado = document.querySelector("#certificado");

    // Garante que o elemento esteja visível e renderizado
    certificado.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise(resolve => setTimeout(resolve, 800));

    html2canvas(certificado, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff"
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "certificado-coronel.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});
