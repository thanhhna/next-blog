import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { message } from 'antd';
import styles from './PlanningPoker.module.scss';
import { io, Socket } from 'socket.io-client';

interface Player {
  name: string;
  score?: number;
}

enum GameStatus {
  Voting = 'voting',
  Revealed = 'revealed'
}

interface Room {
  id?: string;
  players: Player[];
  status: GameStatus;
}

const initialRoom = {
  players: [],
  status: GameStatus.Voting
};

export default function PlanningPoker() {
  const router = useRouter();

  const { r } = router.query;

  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const [username, setUsername] = useState<string | undefined>(undefined);

  const [room, setRoom] = useState<Room>(initialRoom);

  useEffect(() => {
    if (r && socket) {
      socket.emit('roomCheck', { roomId: r });
    }
  }, [r, socket]);

  useEffect(() => {
    const newConnection = io('http://localhost:8080');
    setSocket(newConnection);
    return function () {
      newConnection.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('room', (data) => {
      const { room } = data;
      setRoom(room);
    });

    socket.on('gameCreated', (data) => {
      const { roomId } = data;

      router.push(`${router.basePath}?r=${roomId}`);
    });

    socket.on('roomNotExist', () => {
      setRoom(initialRoom);
      router.push(router.basePath);
      message.error('Room is not exists');
    });
  }, [socket]);

  useEffect(() => {
    if (r) {
      setRoom({ ...room, id: r as string });
    }
  }, [r]);

  const cards = [1, 2, 3, 5, 8];

  const firstHalfPlayers =
    room.players.length > 8
      ? room.players.slice(0, room.players.length / 2 + 1)
      : room.players;
  const secondHalfPlayers =
    room.players.length > 8
      ? room.players.slice(room.players.length / 2 + 1)
      : [];

  const score = (
    room.players.reduce((acc, curr) => {
      if (curr.score) {
        return acc + curr.score;
      }
      return acc;
    }, 0) / room.players.length
  ).toFixed(1);

  const buttonClickable =
    room.players.every((p) => !!p.score) || room.status === GameStatus.Revealed;

  async function handleStartNewGame() {
    socket?.emit('createGame');
  }

  async function handleCloseGame() {
    setRoom(initialRoom);
    socket?.emit('leave');
    await router.push(router.basePath);
  }

  function handleUsernameEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const userInput = (event.target as HTMLInputElement).value;
      if (userInput.trim() === '') {
        message.error('Please enter username');
        return;
      }
      if (userInput.trim().includes(' ')) {
        message.error(`Username can't have spaces`);
        return;
      }
      setUsername(userInput.trim());
      socket?.emit('submitUsername', {
        username: userInput.trim(),
        roomId: room.id
      });
    }
  }

  function handleShowScore() {
    if (room.status === GameStatus.Revealed) {
      socket?.emit('reset');
    } else {
      socket?.emit('reveal');
    }
  }

  function handleVote(score: number) {
    if (room.status === GameStatus.Revealed) {
      return;
    }
    socket?.emit('vote', { score });
  }

  return (
    <div className={styles.planner}>
      <div className={styles.header}>
        <h2>Planning Poker</h2>
        <div className={styles.action}>
          {room.id && (
            <button className={styles.close} onClick={handleCloseGame}>
              x
            </button>
          )}
        </div>
      </div>
      {!room.id && (
        <div className={styles.newGame}>
          <div onClick={handleStartNewGame}>Start new game</div>
        </div>
      )}
      {room.id && (
        <div className={styles.main}>
          <div className={styles.scoreBox}>
            <button
              className={styles.scoreButton}
              disabled={!buttonClickable}
              onClick={handleShowScore}
            >
              {room.status === GameStatus.Voting ? (
                <span>Show score</span>
              ) : (
                <span>Reset</span>
              )}
            </button>
            <div className={styles.score}>
              {room.status === GameStatus.Revealed ? <span>{score}</span> : ''}
            </div>
          </div>
          <div className={styles.cardBox}>
            {cards.map((c, i) => (
              <div
                key={i}
                className={cn(
                  styles.card,
                  room.players.some((p) => p.name === username && p.score === c)
                    ? styles.active
                    : ''
                )}
                onClick={() => handleVote(c)}
              >
                {c}
              </div>
            ))}
          </div>
          <div className={styles.playerList}>
            {firstHalfPlayers.map((p, i) => (
              <div className={styles.player} key={i}>
                <div className={styles.name}>{p.name}</div>
                <div className={cn(styles.card, p.score ? styles.active : '')}>
                  {room.status === GameStatus.Revealed ? p.score : ''}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.playerList}>
            {secondHalfPlayers.map((p, i) => (
              <div className={styles.player} key={i}>
                <div className={styles.name}>{p.name}</div>
                <div
                  className={cn(
                    styles.card,

                    p.score ? styles.active : ''
                  )}
                >
                  {room.status === GameStatus.Revealed ? p.score : ''}
                </div>
              </div>
            ))}
          </div>
          {!username && (
            <div className={styles.usernameModal}>
              <div className={styles.modalContent}>
                <span>Enter your username</span>
                <input onKeyPress={handleUsernameEnter} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
