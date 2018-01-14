<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Comment;
use AppBundle\Entity\Post;
use AppBundle\Form\CommentType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Request;

class EarthquakesController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $qb = $this->getDoctrine()
            ->getManager()
            ->createQueryBuilder();


        $qb->select('p')
            ->from('AppBundle:Post', 'p')
            ->orderBy('p.createdAt', 'DESC');


        $paginator = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
          $qb,
          $request->query->get('page', 1),
          5
        );

        return $this->render('earthquakes/index.html.twig', array(
            'posts' => $pagination,
            'regionID' => -1,
            'regionName' => "World"
        ));
    }


    /**
     * @Route("/article/{id}", name="post_show")
     */
    public function showAction(Post $post, Request $request) {
        $form = null;
        $ruid = $post->getRegionId();

        // if user is logged
        if ($user = $this->getUser()){
            $comment = new Comment();
            $comment->setPost($post);
            $comment->setUser($user);

            $form = $this->createForm(CommentType::class, $comment);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $this->getDoctrine()->getManager()->persist($comment);
                $this->getDoctrine()->getManager()->flush();
                $this->addFlash('Success', 'Comment is successfully added');

                return $this->redirectToRoute('post_show', array('id' => $post->getId()));
            }
        }

        return $this->render('earthquakes/show.html.twig', array(
            'post' => $post,
            'form' => is_null($form) ? $form : $form->createView(),
            'regionID' => $ruid
        ));
    }

    /**
     * @Route("/region-{ruid}", name="region_show")
     */
    public function regionAction($ruid, Request $request) {
        $qb = $this->getDoctrine()
            ->getManager()
            ->createQueryBuilder();

        
        $qb->select('p')
            ->from('AppBundle:Post', 'p')
            ->where('p.regionId = :regionID')
            ->setParameter('regionID', $ruid)
            ->orderBy('p.createdAt', 'DESC');


        $paginator = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
            $qb,
            $request->query->get('page', 1),
            5
        );

        $regionName = "";
        switch ($ruid) {
            case 0:
                $regionName = "Europe";
                break;
            case 1:
                $regionName = "Asia";
                break;
            case 2:
                $regionName = "North America";
                break;
            case 3:
                $regionName = "South America";
                break;
            case 4:
                $regionName = "Africa";
                break;
            case 5:
                $regionName = "Australia";
                break;
        }

        return $this->render('earthquakes/index.html.twig', array(
            'posts' => $pagination,
            'regionID' => $ruid,
            'regionName' => $regionName
        ));
    }
}
