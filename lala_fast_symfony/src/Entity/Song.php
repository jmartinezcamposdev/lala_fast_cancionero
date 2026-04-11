<?php

namespace App\Entity;

use App\Repository\SongRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SongRepository::class)]
#[ORM\Table(name: 'songs')]
#[ORM\Index(name: 'songs_reference_IDX', columns: ['reference'])]
#[ORM\Index(name: 'songs_artist_name_IDX', columns: ['artistName'])]
#[ORM\Index(name: 'songs_song_name_IDX', columns: ['songName'])]
class Song
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 20)]
    private ?string $reference = null;

    #[ORM\Column(name: 'artist_name', type: 'string', length: 100)]
    private ?string $artistName = null;

    #[ORM\Column(name: 'song_name', type: 'string', length: 100)]
    private ?string $songName = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function getArtistName(): ?string
    {
        return $this->artistName;
    }

    public function getSongName(): ?string
    {
        return $this->songName;
    }
}
