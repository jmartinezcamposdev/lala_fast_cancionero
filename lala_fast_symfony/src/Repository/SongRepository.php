<?php

namespace App\Repository;

use App\Entity\Song;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Song>
 */
class SongRepository extends ServiceEntityRepository
{
    private const int ITEMS_PER_PAGE = 10;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Song::class);
    }

    /**
     * @return array<Song>
     */
    public function findRandom(int $limit = self::ITEMS_PER_PAGE): array
    {
        return $this->createQueryBuilder('s')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return array{0: array<Song>, 1: int}
     */
    public function searchByText(string $searchText, int $offset = 0, ?int $limit = self::ITEMS_PER_PAGE): array
    {
        $qb = $this->createQueryBuilder('s')
            ->where('s.artistName LIKE :searchText')
            ->orWhere('s.songName LIKE :searchText')
            ->orWhere('s.reference LIKE :searchText')
            ->setParameter('searchText', '%' . $searchText . '%');

        // Count query
        $countQb = clone $qb;
        $countQb->select('COUNT(DISTINCT s.id)');
        $totalResults = (int) $countQb->getQuery()->getSingleScalarResult();

        // Data query with pagination
        if ($limit !== null) {
            $qb->setFirstResult($offset)
                ->setMaxResults($limit);
        }

        $results = $qb->getQuery()->getResult();

        return [$results, $totalResults];
    }

    public function getTotalCount(): int
    {
        return (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public static function getItemsPerPage(): int
    {
        return self::ITEMS_PER_PAGE;
    }
}
