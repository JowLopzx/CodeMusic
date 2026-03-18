const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

// NOVO: tempo
const timeDisplay = document.createElement('div');
timeDisplay.style.fontSize = '0.9rem';
timeDisplay.style.color = '#aaa';
progressContainer.after(timeDisplay);

// 🎵 Lista com GÊNEROS
const songs = [
    { name: 'Praga de Amor', artist: 'Victor Moury', genre: 'Brega', file: 'victormoury-praga-de-amor-victor-moury-e-michelle-melo-f8308a85.mp3', img: 'victormoury-c8fe090f-6677-4958-8fb2-e521f141d422.avif' },
    { name: 'Sextou já Era', artist: 'Caio Arruda', genre: 'Sertanejo', file: 'caioarrudaoficial-sextou-ja-era-37cf3772.mp3', img: 'caioarrudaoficial-b36c9c80-8afe-4125-9b9b-3fe63db7032d.avif' },
    { name: 'Lei do Retorno', artist: 'Mc Hariel', genre: 'Funk', file: 'mcharielgr6-mc-don-juan-e-lei-do-retorno-video-clipe-dj-yuri-martins-cd7cea54.mp3', img: '1484324532.avif' },
    { name: 'Dançando Calypso', artist: 'Joelma', genre: 'Brega', file: 'JoelmaCantora-13-dancando-calypso-ao-vivo-em-sao-paulo-f5dd349c.mp3', img: 'JoelmaCantora-19482d6a-ce9b-48ef-ba60-f5c961a4ddf8.avif' },
    { name: 'Alô', artist: 'Bruno e Baretto', genre: 'Sertanejo', file: 'brunoebarretto-alo-26b35a3c.mp3', img: 'brunoebarretto-e3e18428-2e35-4e3a-b8ac-9cae68edf488.avif' },
    { name: 'Eu Conto as Horas', artist: 'Moki', genre: 'Funk', file: 'Moki-eu-conto-as-horas-380ec8b1.mp3', img: 'Moki-223999e3-0ad1-4b0b-9815-423ee769b25c.avif' },
    { name: 'The Final Countdown', artist: 'Lambertos', genre: 'Rock', file: 'lambertos-the-final-cowntdown-b08abcd2.mp3', img: '14b24fd492e1449bb714d6c32c02178a.avif' },
    { name: 'Céu Azul', artist: 'P-115', genre: 'Rock', file: 'p-115-ceu-azul-b34d4c80.mp3', img: 'p-115-95c75928-b857-4648-91a1-816c7e4f4953.avif' },
    { name: 'Vlone', artist: 'NastyBoyz', genre: 'Trap', file: 'nastyboyz-vlone-fbe0be0b.mp3', img: 'millionmob-93451de3-1724-4d8b-a715-4a93a560d970.avif' },
    { name: 'Bote Certeiro', artist: 'MvrcoFlow', genre: 'Trap', file: 'mvrcoflow-bote-certeiro-ft-jayvee-99f27ffc.mp3', img: 'baixados.webp' },
];

let songIndex = 0;
let filteredSongs = [...songs];

// 🔄 Carregar música
function loadSong(song) {
    title.innerText = song.name;
    artist.innerText = song.artist;
    audio.src = song.file;
    cover.src = song.img;
}

// ▶️ Play/Pause
function playSong() {
    playBtn.innerText = '⏸';
    audio.play();
}

function pauseSong() {
    playBtn.innerText = '▶';
    audio.pause();
}

playBtn.addEventListener('click', () => {
    audio.paused ? playSong() : pauseSong();
});

// ⏭ Troca
function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = filteredSongs.length - 1;
    loadSong(filteredSongs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex >= filteredSongs.length) songIndex = 0;
    loadSong(filteredSongs[songIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// ⏱ Tempo
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;

    if (duration) {
        const percent = (currentTime / duration) * 100;
        progress.style.width = percent + '%';
        timeDisplay.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
}

audio.addEventListener('timeupdate', updateProgress);

// ⏩ clicar na barra
progressContainer.addEventListener('click', function (e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// 🔁 próxima automática
audio.addEventListener('ended', nextSong);

// 🎯 FILTRO POR GÊNERO
const genres = document.querySelectorAll('.genre');

genres.forEach(btn => {
    btn.addEventListener('click', () => {
        const selected = btn.innerText.replace(/[^a-zA-Z]/g, '');

        // UI ativo
        genres.forEach(g => g.classList.remove('active'));
        btn.classList.add('active');

        filteredSongs = songs.filter(song =>
            song.genre.toLowerCase().includes(selected.toLowerCase())
        );

        if (filteredSongs.length === 0) {
            alert('Nenhuma música encontrada!');
            filteredSongs = [...songs];
        }

        songIndex = 0;
        loadSong(filteredSongs[songIndex]);
        playSong();

        // salvar preferência
        localStorage.setItem('genre', selected);
    });
});

// 💾 carregar preferência salva
window.addEventListener('load', () => {
    const savedGenre = localStorage.getItem('genre');
    if (savedGenre) {
        const btn = [...genres].find(g =>
            g.innerText.includes(savedGenre)
        );
        if (btn) btn.click();
    }
});

// iniciar
loadSong(filteredSongs[songIndex]);