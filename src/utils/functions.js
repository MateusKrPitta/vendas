import axios from "axios";

export function openWhatsAppChat() {
    const phoneNumber = '67996808200';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let whatsappURL = 'https://wa.me/' + phoneNumber;

    if (!isMobile) {
        whatsappURL = 'https://web.whatsapp.com/send?phone=' + phoneNumber;
    }

    window.open(whatsappURL, '_blank');
}

export function openAppStoreLink() {
    const appStoreURL = 'https://apps.apple.com/br/app/pax-primavera/id1559733415';
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
        window.location.href = 'ios://open'; // URI personalizada para iOS
        setTimeout(() => {
            window.location.href = appStoreURL; // Link universal para a App Store
        }, 1000); // Redirecionamento após 1 segundo
    } else {
        window.open(appStoreURL, '_blank');
    }
}

export function openPlayStoreLink() {
    const playStoreURL = 'https://play.google.com/store/apps/details?id=com.paxprimavera.carteirinhas';
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
        window.location.href = playStoreURL; // URI personalizada para Android
        setTimeout(() => {
            window.location.href = playStoreURL; // Link universal para a Play Store
        }, 1000); // Redirecionamento após 1 segundo
    } else {
        window.open(playStoreURL, '_blank');
    }
}
export function formatPhoneNumber(phoneNumber) {

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');


    if (cleanedPhoneNumber.length === 10) {
        // Formato para números de telefone fixos: (dd) xxxx-xxxx
        return `(${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.slice(2, 6)}-${cleanedPhoneNumber.slice(6)}`;
    } else if (cleanedPhoneNumber.length === 11) {
        // Formato para números de telefone móvel: (dd) x xxxx-xxxx
        return `(${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.charAt(2)} ${cleanedPhoneNumber.slice(3, 7)}-${cleanedPhoneNumber.slice(7)}`;
    } else {
        // Retorne o número de telefone original se não corresponder a nenhum dos comprimentos esperados
        return phoneNumber;
    }
}

export function formatCPF(cpf) {
    // Remova todos os caracteres não numéricos do CPF
    const cleanedCPF = cpf.replace(/\D/g, '');

    // Aplica a máscara para CPF: xxx.xxx.xxx-xx
    return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const formatCEP = (cep) => {
    return cep ? cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2') : '';
};

export const buscarEnderecoPorCEP = async (cep) => {
    if (cep.length == 8) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`); // Adicionei as aspas
            const { data } = response;
            if (!data.erro) {
                return {
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                };
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Erro ao buscar CEP.");
        }
    }
    return null;
};

export function formatDate(dateString) {
    if (!dateString) {
        return '';
    }
    // Dividir a data em ano, mês e dia
    const [year, month, day] = dateString.split('-');

    // Retorna a data formatada: dd/mm/yyyy
    return `${day}/${month}/${year}`;
}

export function primeiraLetraMaiuscula(input) {
    return input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais, o que não é válido para um CPF
    const digits = cpf.split('').map(Number);
    if (digits.every(digit => digit === digits[0])) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit > 9) {
        firstDigit = 0;
    }

    // Verifica se o primeiro dígito verificador está correto
    if (parseInt(cpf.charAt(9)) !== firstDigit) {
        return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit > 9) {
        secondDigit = 0;
    }

    // Verifica se o segundo dígito verificador está correto
    if (parseInt(cpf.charAt(10)) !== secondDigit) {
        return false;
    }

    // CPF válido
    return true;
}

export const formatValor = (valor) => {
    const parsedValor = parseFloat(valor); // Converte o valor para número
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, // Garante que sempre tenha duas casas decimais
        maximumFractionDigits: 2, // Garante que não tenha mais que duas casas decimais
    }).format(parsedValor);
};

// Função para formatar o preço por porção sem arredondar
export const formatPrecoPorcao = (valor) => {
    return `R$ ${valor.toFixed(3).replace('.', ',')}`; // Formata com 3 casas decimais
};

export const formatCmvReal = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor / 100); // Divida por 100 para formatar corretamente
};