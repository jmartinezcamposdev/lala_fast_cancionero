<?php

namespace App\Controller;

use App\Repository\SongRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SongController extends AbstractController
{
    #[Route('/', name: 'song_index')]
    public function index(SongRepository $songRepository): Response
    {
        $randomSongs = $songRepository->findRandom();
        $totalCount = $songRepository->getTotalCount();

        return $this->render('song/index.html.twig', [
            'songs' => $randomSongs,
            'totalCount' => $totalCount,
        ]);
    }

    #[Route('/search', name: 'song_search', methods: ['POST'])]
    public function search(Request $request, SongRepository $songRepository): JsonResponse
    {
        $searchText = $request->request->get('text', '');
        $offset = (int) $request->request->get('offset', 0);
        $limit = SongRepository::getItemsPerPage();

        [$songs, $totalResults] = $songRepository->searchByText($searchText, $offset, $limit);

        $songsData = array_map(function ($song) {
            return [
                $song->getReference(),
                $song->getArtistName(),
                $song->getSongName(),
            ];
        }, $songs);

        return new JsonResponse([
            'status' => 'success',
            'songs_data' => $songsData,
            'count' => $totalResults,
        ]);
    }
}
